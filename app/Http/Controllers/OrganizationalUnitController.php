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

        return Inertia::render('organizational-units/index', [
            'units' => $this->buildTree($units),
            'flatUnits' => $this->flattenUnits($units),
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
     * @param  Collection<int, OrganizationalUnit>  $units
     * @return list<array{id: string, type: string, name: string, parent_id: string|null, sort_order: int, children: list<array>}>
     */
    private function buildTree(Collection $units, ?string $parentId = null): array
    {
        return $this->unitsForParent($units, $parentId)
            ->map(fn (OrganizationalUnit $unit): array => [
                'id' => $unit->getKey(),
                'type' => $unit->type instanceof OrganizationalUnitType ? $unit->type->label() : $unit->type,
                'name' => $unit->name,
                'parent_id' => $unit->parent_id,
                'sort_order' => $unit->sort_order,
                'children' => $this->buildTree($units, $unit->getKey()),
            ])
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, OrganizationalUnit>  $units
     * @return list<array{id: string, type: string, name: string, parent_id: string|null, sort_order: int, depth: int}>
     */
    private function flattenUnits(Collection $units, ?string $parentId = null, int $depth = 0): array
    {
        return $this->unitsForParent($units, $parentId)
            ->flatMap(fn (OrganizationalUnit $unit): array => [
                [
                    'id' => $unit->getKey(),
                    'type' => $unit->type instanceof OrganizationalUnitType ? $unit->type->label() : $unit->type,
                    'name' => $unit->name,
                    'parent_id' => $unit->parent_id,
                    'sort_order' => $unit->sort_order,
                    'depth' => $depth,
                ],
                ...$this->flattenUnits($units, $unit->getKey(), $depth + 1),
            ])
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, OrganizationalUnit>  $units
     * @return Collection<int, OrganizationalUnit>
     */
    private function unitsForParent(Collection $units, ?string $parentId): Collection
    {
        if ($parentId !== null) {
            return $units->filter(fn (OrganizationalUnit $unit): bool => $unit->parent_id === $parentId);
        }

        $availableUnitIds = $units
            ->map(fn (OrganizationalUnit $unit): string => $unit->getKey())
            ->flip();

        return $units->filter(
            fn (OrganizationalUnit $unit): bool => $unit->parent_id === null
                || ! $availableUnitIds->has($unit->parent_id)
        );
    }
}
