<?php

namespace App\Models;

use Database\Factories\CustomerFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name'])]
class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (Customer $customer) {
            $customer->validateName();
        });

        static::deleting(function (Customer $customer) {
            UserCustomerAssignment::query()
                ->where('customer_id', $customer->getKey())
                ->delete();

            UserSiteAssignment::query()
                ->whereHas('site', fn ($query) => $query->withTrashed()->where('customer_id', $customer->getKey()))
                ->delete();
        });
    }

    /**
     * @return HasMany<Site, $this>
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * @return HasMany<UserCustomerAssignment, $this>
     */
    public function userAssignments(): HasMany
    {
        return $this->hasMany(UserCustomerAssignment::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_customer_assignments')
            ->withTimestamps();
    }

    private function validateName(): void
    {
        $name = $this->getAttributes()['name'] ?? null;

        if (! is_string($name) || trim($name) === '') {
            throw new DomainException('A customer requires a name.');
        }
    }
}
