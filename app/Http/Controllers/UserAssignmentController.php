<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserAssignments\StoreCustomerAssignmentRequest;
use App\Http\Requests\UserAssignments\StoreOrganizationalUnitAssignmentRequest;
use App\Http\Requests\UserAssignments\StoreSiteAssignmentRequest;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use App\Models\UserOrganizationalUnitAssignment;
use App\Models\UserSiteAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserAssignmentController extends Controller
{
    public function redirectToFirstUser(): RedirectResponse
    {
        $this->authorize('viewAny', User::class);

        $user = User::query()
            ->select(['id'])
            ->orderBy('name')
            ->orderBy('email')
            ->firstOrFail();

        return to_route('user-assignments.index', $user);
    }

    public function index(User $user): Response
    {
        $this->authorize('viewAny', User::class);
        $canManageAssignments = Gate::allows('manage', $user);

        $user->load([
            'organizationalUnits' => fn ($query) => $query->select(['organizational_units.id', 'type', 'name'])->orderBy('name'),
            'customers' => fn ($query) => $query->select(['customers.id', 'name'])->orderBy('name'),
            'sites' => fn ($query) => $query->select(['sites.id', 'customer_id', 'name'])->orderBy('name'),
            'sites.customer' => fn ($query) => $query->select(['customers.id', 'name']),
        ]);

        $options = [
            'organizationalUnits' => [],
            'customers' => [],
            'sites' => [],
        ];

        if ($canManageAssignments) {
            $options = [
                'organizationalUnits' => OrganizationalUnit::query()
                    ->select(['id', 'type', 'name'])
                    ->orderBy('name')
                    ->get()
                    ->map(fn (OrganizationalUnit $unit): array => [
                        'id' => $unit->getKey(),
                        'type' => $this->organizationalUnitTypeLabel($unit->type),
                        'name' => $unit->name,
                    ]),
                'customers' => Customer::query()
                    ->select(['id', 'name'])
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Customer $customer): array => [
                        'id' => $customer->getKey(),
                        'name' => $customer->name,
                    ]),
                'sites' => Site::query()
                    ->with('customer:id,name')
                    ->select(['id', 'customer_id', 'name'])
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Site $site): array => [
                        'id' => $site->getKey(),
                        'customer_id' => $site->customer_id,
                        'customer_name' => $site->customer?->name,
                        'name' => $site->name,
                    ]),
            ];
        }

        return Inertia::render('user-assignments/index', [
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
                'organizationalUnits' => $user->organizationalUnits->map(fn (OrganizationalUnit $unit): array => [
                    'id' => $unit->getKey(),
                    'type' => $this->organizationalUnitTypeLabel($unit->type),
                    'name' => $unit->name,
                ])->values(),
                'customers' => $user->customers->map(fn (Customer $customer): array => [
                    'id' => $customer->getKey(),
                    'name' => $customer->name,
                ])->values(),
                'sites' => $user->sites->map(fn (Site $site): array => [
                    'id' => $site->getKey(),
                    'customer_id' => $site->customer_id,
                    'customer_name' => $site->customer?->name,
                    'name' => $site->name,
                ])->values(),
            ],
            'options' => $options,
            'canManageAssignments' => $canManageAssignments,
        ]);
    }

    public function storeOrganizationalUnit(StoreOrganizationalUnitAssignmentRequest $request, User $user): RedirectResponse
    {
        $this->authorize('manage', $user);

        $validated = $request->validated();

        UserOrganizationalUnitAssignment::query()->create([
            'user_id' => $user->getKey(),
            'organizational_unit_id' => $validated['organizational_unit_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit assignment added.']);

        return to_route('user-assignments.index', $user);
    }

    public function destroyOrganizationalUnit(User $user, OrganizationalUnit $organizationalUnit): RedirectResponse
    {
        $this->authorize('manage', $user);

        UserOrganizationalUnitAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('organizational_unit_id', $organizationalUnit->getKey())
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit assignment removed.']);

        return to_route('user-assignments.index', $user);
    }

    public function storeCustomer(StoreCustomerAssignmentRequest $request, User $user): RedirectResponse
    {
        $this->authorize('manage', $user);

        $validated = $request->validated();

        UserCustomerAssignment::query()->create([
            'user_id' => $user->getKey(),
            'customer_id' => $validated['customer_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer assignment added.']);

        return to_route('user-assignments.index', $user);
    }

    public function destroyCustomer(User $user, Customer $customer): RedirectResponse
    {
        $this->authorize('manage', $user);

        UserCustomerAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('customer_id', $customer->getKey())
            ->delete();

        UserSiteAssignment::query()
            ->where('user_id', $user->getKey())
            ->whereIn('site_id', Site::withTrashed()
                ->select('id')
                ->where('customer_id', $customer->getKey()))
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer assignment removed.']);

        return to_route('user-assignments.index', $user);
    }

    public function storeSite(StoreSiteAssignmentRequest $request, User $user): RedirectResponse
    {
        $this->authorize('manage', $user);

        $validated = $request->validated();

        $site = Site::query()->select(['id', 'customer_id'])->findOrFail($validated['site_id']);

        $hasCustomerAssignment = UserCustomerAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('customer_id', $site->customer_id)
            ->exists();

        if (! $hasCustomerAssignment) {
            throw ValidationException::withMessages([
                'site_id' => 'Assign the customer before assigning one of its sites.',
            ]);
        }

        UserSiteAssignment::query()->create([
            'user_id' => $user->getKey(),
            'site_id' => $site->getKey(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Site assignment added.']);

        return to_route('user-assignments.index', $user);
    }

    public function destroySite(User $user, Site $site): RedirectResponse
    {
        $this->authorize('manage', $user);

        UserSiteAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('site_id', $site->getKey())
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Site assignment removed.']);

        return to_route('user-assignments.index', $user);
    }
}
