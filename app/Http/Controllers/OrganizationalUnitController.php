<?php

namespace App\Http\Controllers;

use App\Enums\OrganizationalUnitType;
use App\Models\OrganizationalUnit;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationalUnitController extends Controller
{
    public function index(): Response
    {
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
                    'label' => ucfirst($type->value),
                ])
                ->values()
                ->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        OrganizationalUnit::query()->create($this->validatedData($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organizational unit created.']);

        return to_route('organizational-units.index');
    }

    public function update(Request $request, OrganizationalUnit $organizationalUnit): RedirectResponse
    {
        try {
            $organizationalUnit->fill($this->validatedData($request));
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
     * @return array{type: string, name: string, parent_id: string|null, sort_order: int}
     */
    private function validatedData(Request $request): array
    {
        $validated = $request->validate([
            'type' => ['required', Rule::enum(OrganizationalUnitType::class)],
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'uuid',
                Rule::exists('organizational_units', 'id')->whereNull('deleted_at'),
            ],
            'sort_order' => ['required', 'integer', 'min:0', 'max:2147483647'],
        ]);

        return [
            'type' => $validated['type'],
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
        ];
    }

    /**
     * @param  Collection<int, OrganizationalUnit>  $units
     * @return list<array{id: string, type: string, name: string, parent_id: string|null, sort_order: int, children: list<array>}>
     */
    private function buildTree(Collection $units, ?string $parentId = null): array
    {
        return $units
            ->filter(fn (OrganizationalUnit $unit): bool => $unit->parent_id === $parentId)
            ->map(fn (OrganizationalUnit $unit): array => [
                'id' => $unit->getKey(),
                'type' => $this->typeValue($unit->type),
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
        return $units
            ->filter(fn (OrganizationalUnit $unit): bool => $unit->parent_id === $parentId)
            ->flatMap(fn (OrganizationalUnit $unit): array => [
                [
                    'id' => $unit->getKey(),
                    'type' => $this->typeValue($unit->type),
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

    private function typeValue(OrganizationalUnitType|string $type): string
    {
        if ($type instanceof OrganizationalUnitType) {
            return $type->value;
        }

        return $type;
    }
}
