<?php

namespace App\Models;

use Database\Factories\UserOrganizationalUnitAssignmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'organizational_unit_id'])]
class UserOrganizationalUnitAssignment extends Model
{
    /** @use HasFactory<UserOrganizationalUnitAssignmentFactory> */
    use HasFactory, HasUuids;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<OrganizationalUnit, $this>
     */
    public function organizationalUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationalUnit::class);
    }
}
