<?php

namespace App\Models;

use Database\Factories\SiteFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['customer_id', 'organizational_unit_id', 'name'])]
class Site extends Model
{
    /** @use HasFactory<SiteFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (Site $site) {
            $site->validateRequiredFields();
        });

        static::deleting(function (Site $site) {
            UserSiteAssignment::query()
                ->where('site_id', $site->getKey())
                ->delete();
        });
    }

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<OrganizationalUnit, $this>
     */
    public function organizationalUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationalUnit::class);
    }

    /**
     * @return HasMany<UserSiteAssignment, $this>
     */
    public function userAssignments(): HasMany
    {
        return $this->hasMany(UserSiteAssignment::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_site_assignments')
            ->withTimestamps();
    }

    private function validateRequiredFields(): void
    {
        $name = $this->getAttributes()['name'] ?? null;
        $customerId = $this->getAttributes()['customer_id'] ?? null;

        if (! is_string($name) || trim($name) === '') {
            throw new DomainException('A site requires a name.');
        }

        if (! is_string($customerId) || trim($customerId) === '') {
            throw new DomainException('A site requires a customer.');
        }
    }
}
