<?php

namespace App\Http\Controllers;

use App\Auth\GuardGuideAccessCatalog;
use App\Http\Requests\Roles\SaveRoleRequest;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class RoleManagementController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Role::class);

        return Inertia::render('roles/index', [
            'roles' => Role::query()
                ->select(['id', 'name', 'label', 'guard_name'])
                ->where('guard_name', GuardGuideAccessCatalog::GUARD)
                ->withCount('users')
                ->with('permissions:id,name,guard_name')
                ->orderBy('label')
                ->orderBy('name')
                ->get()
                ->map(fn (Role $role): array => $this->serializeRole($role))
                ->values(),
            'permissions' => collect(GuardGuideAccessCatalog::permissions())
                ->map(fn (string $description, string $name): array => [
                    'name' => $name,
                    'description' => $description,
                ])
                ->values(),
            'capabilities' => [
                'create' => request()->user()?->can('create', Role::class) ?? false,
                'update' => request()->user()?->can('updateAny', Role::class) ?? false,
                'delete' => request()->user()?->can('deleteAny', Role::class) ?? false,
            ],
        ]);
    }

    public function store(SaveRoleRequest $request): RedirectResponse
    {
        $validated = $request->validatedRole();

        $role = Role::create([
            'name' => $validated['name'],
            'label' => $validated['label'],
            'guard_name' => GuardGuideAccessCatalog::GUARD,
        ]);

        $this->syncPermissions($role, $validated['permissions']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role created.']);

        return to_route('roles.index');
    }

    public function update(SaveRoleRequest $request, Role $role): RedirectResponse
    {
        $validated = $request->validatedRole();

        $role->forceFill([
            'name' => $validated['name'],
            'label' => $validated['label'],
        ])->save();

        $this->syncPermissions($role, $validated['permissions']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role updated.']);

        return to_route('roles.index');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('delete', $role);

        if ($role->users()->exists()) {
            throw ValidationException::withMessages([
                'role' => 'Assigned roles cannot be deleted.',
            ]);
        }

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role deleted.']);

        return to_route('roles.index');
    }

    /**
     * @param  list<string>  $permissionNames
     */
    private function syncPermissions(Role $role, array $permissionNames): void
    {
        $permissions = Permission::query()
            ->where('guard_name', GuardGuideAccessCatalog::GUARD)
            ->whereIn('name', $permissionNames)
            ->get();

        $role->syncPermissions($permissions);
    }

    /**
     * @return array{id: int|string, name: string, label: string, permissions: list<string>, usersCount: int, canUpdate: bool, canDelete: bool}
     */
    private function serializeRole(Role $role): array
    {
        $usersCount = $role->users_count ?? 0;

        return [
            'id' => $role->getKey(),
            'name' => $role->name,
            'label' => $role->label ?? $role->name,
            'permissions' => $role->permissions->pluck('name')->sort()->values()->all(),
            'usersCount' => $usersCount,
            'canUpdate' => request()->user()?->can('update', $role) ?? false,
            'canDelete' => $usersCount === 0
                && (request()->user()?->can('delete', $role) ?? false),
        ];
    }
}
