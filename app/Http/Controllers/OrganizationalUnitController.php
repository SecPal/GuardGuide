<?php

namespace App\Http\Controllers;

use App\Enums\OrganizationalUnitType;
use App\Http\Requests\OrganizationalUnits\SaveOrganizationalUnitRequest;
use App\Models\OrganizationalUnit;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationalUnitController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', OrganizationalUnit::class);

        $units = OrganizationalUnit::query()
            ->select(['id', 'type', 'name', 'parent_id', 'sort_order'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $childrenByParent = $this->groupChildrenByParent($units);
        $rootParents = $this->rootParents($units);

        return Inertia::render('organizational-units/index', [
            'units' => $this->buildTree($childrenByParent, $rootParents),
            'flatUnits' => $this->flattenUnits($childrenByParent, $rootParents),
            'typeOptions' => collect(OrganizationalUnitType::cases())
                ->map(fn (OrganizationalUnitType $type): array => [
                    'value' => $type->value,
                    'label' => ucfirst($type->label()),
                ])
                ->values()
                ->all(),
        ]);
    }

    public function store(SaveOrganizationalUnitRequest $request): RedirectResponse
    {
        $this->authorize('create', OrganizationalUnit::class);

        try {
            OrganizationalUnit::query()->create($request->validatedUnit());
        } catch (DomainException $exception) {
            throw ValidationException::withMessages([
                'parent_id' => $exception->getMessage(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit created.']);

        return to_route('organizational-units.index');
    }

    public function update(SaveOrganizationalUnitRequest $request, OrganizationalUnit $organizationalUnit): RedirectResponse
    {
        $this->authorize('update', $organizationalUnit);

        try {
            $organizationalUnit->fill($request->validatedUnit());
            $organizationalUnit->save();
        } catch (DomainException $exception) {
            throw ValidationException::withMessages([
                'parent_id' => $exception->getMessage(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit updated.']);

        return to_route('organizational-units.index');
    }

    /**
     * @param  array<string, list<OrganizationalUnit>>  $childrenByParent
     * @param  list<OrganizationalUnit>  $units
     * @return list<array{id: string, type: string, name: string, parent_id: string|null, sort_order: int, children: list<array>}>
     */
    private function buildTree(array $childrenByParent, array $units): array
    {
        $tree = [];

        foreach ($units as $unit) {
            $tree[] = [
                'id' => $unit->getKey(),
                'type' => $this->organizationalUnitTypeLabel($unit->type),
                'name' => $unit->name,
                'parent_id' => $unit->parent_id,
                'sort_order' => $unit->sort_order,
                'children' => $this->buildTree($childrenByParent, $childrenByParent[$unit->getKey()] ?? []),
            ];
        }

        return $tree;
    }

    /**
     * @param  array<string, list<OrganizationalUnit>>  $childrenByParent
     * @param  list<OrganizationalUnit>  $units
     * @return list<array{id: string, type: string, name: string, parent_id: string|null, sort_order: int, depth: int}>
     */
    private function flattenUnits(array $childrenByParent, array $units, int $depth = 0): array
    {
        $flat = [];

        foreach ($units as $unit) {
            $flat[] = [
                'id' => $unit->getKey(),
                'type' => $this->organizationalUnitTypeLabel($unit->type),
                'name' => $unit->name,
                'parent_id' => $unit->parent_id,
                'sort_order' => $unit->sort_order,
                'depth' => $depth,
            ];

            $flat = [
                ...$flat,
                ...$this->flattenUnits($childrenByParent, $childrenByParent[$unit->getKey()] ?? [], $depth + 1),
            ];
        }

        return $flat;
    }

    /**
     * Group units by their parent id so child lookups are O(1) during recursion.
     *
     * @param  Collection<int, OrganizationalUnit>  $units
     * @return array<string, list<OrganizationalUnit>>
     */
    private function groupChildrenByParent(Collection $units): array
    {
        $grouped = [];

        foreach ($units as $unit) {
            $parentId = $unit->parent_id;

            if ($parentId === null) {
                continue;
            }

            $grouped[$parentId] ??= [];
            $grouped[$parentId][] = $unit;
        }

        return $grouped;
    }

    /**
     * Return units that should appear at the visual root: real roots and units
     * whose parent is missing from the available set (e.g. soft-deleted parent).
     *
     * @param  Collection<int, OrganizationalUnit>  $units
     * @return list<OrganizationalUnit>
     */
    private function rootParents(Collection $units): array
    {
        $availableIds = [];

        foreach ($units as $unit) {
            $availableIds[$unit->getKey()] = true;
        }

        $roots = [];

        foreach ($units as $unit) {
            if ($unit->parent_id === null || ! isset($availableIds[$unit->parent_id])) {
                $roots[] = $unit;
            }
        }

        return $roots;
    }
}
