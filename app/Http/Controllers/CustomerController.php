<?php

namespace App\Http\Controllers;

use App\Auth\GuardGuideAccessCatalog;
use App\Http\Requests\Customers\SaveCustomerRequest;
use App\Models\Customer;
use App\Models\User;
use App\Services\AssignmentAccessScope;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request, AssignmentAccessScope $accessScope): Response
    {
        $this->authorize('viewAny', Customer::class);

        /** @var User $user */
        $user = $request->user();

        return Inertia::render('customers/index', [
            'customers' => $accessScope->readableCustomers($user)
                ->select(['id', 'name'])
                ->withCount('sites')
                ->orderBy('name')
                ->get()
                ->map(fn (Customer $customer): array => [
                    'id' => $customer->getKey(),
                    'name' => $customer->name,
                    'sites_count' => (int) $customer->getAttribute('sites_count'),
                    'can_update' => $user->can('update', $customer),
                ]),
            'canCreateCustomers' => $user->can(GuardGuideAccessCatalog::CUSTOMERS_CREATE),
        ]);
    }

    public function store(SaveCustomerRequest $request): RedirectResponse
    {
        $this->authorize('create', Customer::class);

        try {
            Customer::query()->create($request->validatedCustomer());
        } catch (DomainException $exception) {
            throw ValidationException::withMessages([
                'name' => $exception->getMessage(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer created.']);

        return to_route('customers.index');
    }

    public function update(SaveCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $this->authorize('update', $customer);

        try {
            $customer->fill($request->validatedCustomer());
            $customer->save();
        } catch (DomainException $exception) {
            throw ValidationException::withMessages([
                'name' => $exception->getMessage(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer updated.']);

        return to_route('customers.index');
    }
}
