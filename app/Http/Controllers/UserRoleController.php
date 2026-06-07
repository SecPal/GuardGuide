<?php

namespace App\Http\Controllers;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    public function redirectToFirstUser(): RedirectResponse
    {
        $user = User::query()
            ->select(['id'])
            ->orderBy('name')
            ->orderBy('email')
            ->firstOrFail();

        $this->authorize('viewRoles', $user);

        return to_route('user-roles.index', $user);
    }

    public function index(User $user): Response
    {
        $this->authorize('viewRoles', $user);

        $assignedRoleIds = $user->roles()
            ->select(['roles.id', 'roles.name', 'roles.guard_name'])
            ->where('guard_name', GuardGuideAccessCatalog::GUARD);

        $assignedRoles = Role::query()
            ->select(['id', 'name', 'guard_name'])
            ->whereIn('id', $assignedRoleIds->select('roles.id'))
            ->orderBy('name')
            ->get();

        return Inertia::render('user-roles/index', [
            'selectedUser' => [
                'id' => $user->getKey(),
                'name' => $user->name,
                'email' => $user->email,
            ],
            'users' => User::query()
                ->select(['id', 'name', 'email'])
                ->orderBy('name')
                ->orderBy('email')
                ->get()
                ->map(fn (User $u): array => [
                    'id' => $u->getKey(),
                    'name' => $u->name,
                    'email' => $u->email,
                ]),
            'assignments' => [
                'roles' => $assignedRoles->map(fn (Role $role): array => $this->serializeRole($role))->values(),
            ],
            'options' => [
                'roles' => Role::query()
                    ->select(['id', 'name', 'guard_name'])
                    ->where('guard_name', GuardGuideAccessCatalog::GUARD)
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Role $role): array => $this->serializeRole($role)),
            ],
            'canManageRoles' => Gate::allows('manageRoles', $user),
        ]);
    }

    public function store(Request $request, User $user): RedirectResponse
    {
        $this->authorize('manageRoles', $user);

        $validated = $request->validate([
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id')->where('guard_name', GuardGuideAccessCatalog::GUARD),
            ],
        ]);

        $role = Role::query()
            ->where('guard_name', GuardGuideAccessCatalog::GUARD)
            ->findOrFail($validated['role_id']);

        $user->assignRole($role);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role assigned.']);

        return to_route('user-roles.index', $user);
    }

    public function destroy(User $user, Role $role): RedirectResponse
    {
        $this->authorize('manageRoles', $user);

        abort_unless($role->guard_name === GuardGuideAccessCatalog::GUARD, 404);

        $user->removeRole($role);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role removed.']);

        return to_route('user-roles.index', $user);
    }

    /**
     * @return array{id: int|string, name: string, label: string}
     */
    private function serializeRole(Role $role): array
    {
        $definition = GuardGuideAccessCatalog::roles()[$role->name] ?? null;

        return [
            'id' => $role->getKey(),
            'name' => $role->name,
            'label' => $definition['name'] ?? $role->name,
        ];
    }
}
