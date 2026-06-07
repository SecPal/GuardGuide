<?php

namespace App\Models;

use App\Enums\OrganizationalUnitType;
use Database\Factories\OrganizationalUnitFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use ValueError;

/**
 * @property OrganizationalUnitType $type
 */
#[Fillable(['type', 'name', 'parent_id', 'sort_order'])]
class OrganizationalUnit extends Model
{
    /** @use HasFactory<OrganizationalUnitFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (OrganizationalUnit $unit) {
            $unit->validateType();
            $unit->validateName();
            $unit->validateHierarchy();
        });

        static::deleting(function (OrganizationalUnit $unit) {
            UserOrganizationalUnitAssignment::query()
                ->where('organizational_unit_id', $unit->getKey())
                ->delete();
        });
    }

    /**
     * @return BelongsTo<OrganizationalUnit, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * @return HasMany<OrganizationalUnit, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')
            ->orderBy('sort_order')
            ->orderBy('name');
    }

    /**
     * @return HasMany<Site, $this>
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * @return HasMany<UserOrganizationalUnitAssignment, $this>
     */
    public function userAssignments(): HasMany
    {
        return $this->hasMany(UserOrganizationalUnitAssignment::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_organizational_unit_assignments')
            ->withTimestamps();
    }

    #[Scope]
    protected function roots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => OrganizationalUnitType::class,
            'sort_order' => 'integer',
        ];
    }

    private function validateType(): void
    {
        $type = $this->getAttributes()['type'] ?? null;

        if ($type instanceof OrganizationalUnitType) {
            return;
        }

        if (is_string($type) && in_array($type, OrganizationalUnitType::values(), true)) {
            return;
        }

        throw new ValueError('Invalid organizational unit type.');
    }

    private function validateName(): void
    {
        $name = $this->getAttributes()['name'] ?? null;

        if (! is_string($name) || trim($name) === '') {
            throw new DomainException('An organizational unit requires a name.');
        }
    }

    private function validateHierarchy(): void
    {
        if ($this->parent_id === null) {
            return;
        }

        if ($this->exists && $this->parent_id === $this->getKey()) {
            throw new DomainException('An organizational unit cannot be its own parent.');
        }

        $ancestor = self::query()
            ->withoutGlobalScopes()
            ->select(['id', 'parent_id'])
            ->find($this->parent_id);
        $visitedAncestorIds = [];

        while ($ancestor !== null) {
            $ancestorId = $ancestor->getKey();

            if ($this->exists && $ancestorId === $this->getKey()) {
                throw new DomainException('An organizational unit cannot reference one of its descendants as parent.');
            }

            if (isset($visitedAncestorIds[$ancestorId])) {
                throw new DomainException('An organizational unit cannot reference a parent in a cyclic hierarchy.');
            }

            $visitedAncestorIds[$ancestorId] = true;

            $ancestor = $ancestor->parent()
                ->withoutGlobalScopes()
                ->select(['id', 'parent_id'])
                ->first();
        }
    }
}
