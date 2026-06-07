<?php

namespace App\Http\Controllers;

use App\Auth\GuardGuideAccessCatalog;
use App\Http\Requests\Sites\SaveSiteRequest;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Services\AssignmentAccessScope;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function index(Request $request, AssignmentAccessScope $accessScope): Response
    {
        $this->authorize('viewAny', Site::class);

        /** @var User $user */
        $user = $request->user();

        return Inertia::render('sites/index', [
            'sites' => $accessScope->readableSites($user)
                ->select(['id', 'customer_id', 'organizational_unit_id', 'name'])
                ->with(['customer:id,name', 'organizationalUnit:id,name'])
                ->orderBy('name')
                ->get()
                ->map(fn (Site $site): array => [
                    'id' => $site->getKey(),
                    'name' => $site->name,
                    'customer_id' => $site->customer_id,
                    'customer_name' => $site->customer?->name,
                    'organizational_unit_id' => $site->organizational_unit_id,
                    'organizational_unit_name' => $site->organizationalUnit?->name,
                    'can_update' => $user->can('update', $site),
                ]),
            'customers' => $accessScope->writableCustomers($user)
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn ($customer): array => [
                    'id' => $customer->getKey(),
                    'name' => $customer->name,
                ]),
            'organizationalUnits' => $accessScope->readableOrganizationalUnits($user)
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn (OrganizationalUnit $unit): array => [
                    'id' => $unit->getKey(),
                    'name' => $unit->name,
                ]),
            'canCreateSites' => $user->can(GuardGuideAccessCatalog::SITES_CREATE)
                && $accessScope->writableCustomers($user)->exists(),
        ]);
    }

    public function store(SaveSiteRequest $request): RedirectResponse
    {
        $this->authorize('create', Site::class);

        try {
            Site::query()->create($request->validatedSite());
        } catch (DomainException $exception) {
            throw ValidationException::withMessages([
                'name' => $exception->getMessage(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Site created.']);

        return to_route('sites.index');
    }

    public function update(SaveSiteRequest $request, Site $site): RedirectResponse
    {
        $this->authorize('update', $site);

        try {
            $site->fill($request->validatedSite());
            $site->save();
        } catch (DomainException $exception) {
            throw ValidationException::withMessages([
                'name' => $exception->getMessage(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Site updated.']);

        return to_route('sites.index');
    }
}
