<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['is_admin', 'password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected string $guard_name = 'web';

    /**
     * @return HasMany<UserOrganizationalUnitAssignment, $this>
     */
    public function organizationalUnitAssignments(): HasMany
    {
        return $this->hasMany(UserOrganizationalUnitAssignment::class);
    }

    /**
     * @return BelongsToMany<OrganizationalUnit, $this>
     */
    public function organizationalUnits(): BelongsToMany
    {
        return $this->belongsToMany(OrganizationalUnit::class, 'user_organizational_unit_assignments')
            ->withTimestamps();
    }

    /**
     * @return HasMany<UserCustomerAssignment, $this>
     */
    public function customerAssignments(): HasMany
    {
        return $this->hasMany(UserCustomerAssignment::class);
    }

    /**
     * @return BelongsToMany<Customer, $this>
     */
    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'user_customer_assignments')
            ->withTimestamps();
    }

    /**
     * @return HasMany<UserSiteAssignment, $this>
     */
    public function siteAssignments(): HasMany
    {
        return $this->hasMany(UserSiteAssignment::class);
    }

    /**
     * @return BelongsToMany<Site, $this>
     */
    public function sites(): BelongsToMany
    {
        return $this->belongsToMany(Site::class, 'user_site_assignments')
            ->withTimestamps();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_admin' => 'boolean',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
