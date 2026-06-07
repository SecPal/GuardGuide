<?php

namespace App\Http\Requests\UserAssignments;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $actingUser */
        $actingUser = $this->user();

        /** @var User|null $targetUser */
        $targetUser = $this->route('user');

        return $actingUser !== null
            && $targetUser instanceof User
            && $actingUser->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var User $targetUser */
        $targetUser = $this->route('user');

        return [
            'customer_id' => [
                'required',
                'uuid',
                Rule::exists('customers', 'id')->whereNull('deleted_at'),
                Rule::unique('user_customer_assignments', 'customer_id')
                    ->where('user_id', $targetUser->getKey()),
            ],
        ];
    }
}
