<?php

namespace App\Http\Controllers;

use App\Enums\OrganizationalUnitType;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use App\Models\UserOrganizationalUnitAssignment;
use App\Models\UserSiteAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserAssignmentController extends Controller
{
    public function redirectToFirstUser(): RedirectResponse
    {
        $user = User::query()
            ->select(['id'])
            ->orderBy('name')
            ->orderBy('email')
            ->firstOrFail();

        return to_route('user-assignments.index', $user);
    }

    public function index(User $user): Response
    {
        $user->load([
            'organizationalUnits' => fn ($query) => $query->select(['organizational_units.id', 'type', 'name'])->orderBy('name'),
            'customers' => fn ($query) => $query->select(['customers.id', 'name'])->orderBy('name'),
            'sites.customer:id,name',
            'sites' => fn ($query) => $query->select(['sites.id', 'customer_id', 'name'])->orderBy('name'),
        ]);

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
                ->map(fn (User $user): array => [
                    'id' => $user->getKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                ]),
            'assignments' => [
                'organizationalUnits' => $user->organizationalUnits->map(fn (OrganizationalUnit $unit): array => [
                    'id' => $unit->getKey(),
                    'type' => $this->typeValue($unit->type),
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
            'options' => [
                'organizationalUnits' => OrganizationalUnit::query()
                    ->select(['id', 'type', 'name'])
                    ->orderBy('name')
                    ->get()
                    ->map(fn (OrganizationalUnit $unit): array => [
                        'id' => $unit->getKey(),
                        'type' => $this->typeValue($unit->type),
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
            ],
        ]);
    }

    public function storeOrganizationalUnit(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'organizational_unit_id' => [
                'required',
                'uuid',
                Rule::exists('organizational_units', 'id')->whereNull('deleted_at'),
                Rule::unique('user_organizational_unit_assignments', 'organizational_unit_id')
                    ->where('user_id', $user->getKey()),
            ],
        ]);

        UserOrganizationalUnitAssignment::query()->create([
            'user_id' => $user->getKey(),
            'organizational_unit_id' => $validated['organizational_unit_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit assignment added.']);

        return to_route('user-assignments.index', $user);
    }

    public function destroyOrganizationalUnit(User $user, OrganizationalUnit $organizationalUnit): RedirectResponse
    {
        UserOrganizationalUnitAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('organizational_unit_id', $organizationalUnit->getKey())
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit assignment removed.']);

        return to_route('user-assignments.index', $user);
    }

    public function storeCustomer(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => [
                'required',
                'uuid',
                Rule::exists('customers', 'id')->whereNull('deleted_at'),
                Rule::unique('user_customer_assignments', 'customer_id')
                    ->where('user_id', $user->getKey()),
            ],
        ]);

        UserCustomerAssignment::query()->create([
            'user_id' => $user->getKey(),
            'customer_id' => $validated['customer_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer assignment added.']);

        return to_route('user-assignments.index', $user);
    }

    public function destroyCustomer(User $user, Customer $customer): RedirectResponse
    {
        UserCustomerAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('customer_id', $customer->getKey())
            ->delete();

        UserSiteAssignment::query()
            ->where('user_id', $user->getKey())
            ->whereHas('site', fn ($query) => $query->withTrashed()->where('customer_id', $customer->getKey()))
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer assignment removed.']);

        return to_route('user-assignments.index', $user);
    }

    public function storeSite(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'site_id' => [
                'required',
                'uuid',
                Rule::exists('sites', 'id')->whereNull('deleted_at'),
                Rule::unique('user_site_assignments', 'site_id')
                    ->where('user_id', $user->getKey()),
            ],
        ]);

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
        UserSiteAssignment::query()
            ->where('user_id', $user->getKey())
            ->where('site_id', $site->getKey())
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Site assignment removed.']);

        return to_route('user-assignments.index', $user);
    }

    private function typeValue(OrganizationalUnitType|string $type): string
    {
        if ($type instanceof OrganizationalUnitType) {
            return $type->value;
        }

        return $type;
    }
}
