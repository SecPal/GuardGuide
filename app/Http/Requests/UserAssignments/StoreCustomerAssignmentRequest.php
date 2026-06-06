<?php

namespace App\Http\Requests\UserAssignments;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
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
