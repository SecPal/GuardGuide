<?php

namespace App\Http\Requests\Customers;

use App\Models\Customer;
use App\Models\User;
use App\Services\CustomerOrganizationalUnitAccess;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        if ($user === null) {
            return false;
        }

        if ($this->isMethod('post')) {
            return $user->can('create', Customer::class);
        }

        /** @var Customer|null $customer */
        $customer = $this->route('customer');

        return $customer instanceof Customer && $user->can('update', $customer);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $organizationRules = [];

        if ($this->isMethod('post')) {
            /** @var User $user */
            $user = $this->user();
            $organizationAccess = app(CustomerOrganizationalUnitAccess::class)->forUser($user);

            $organizationRules = [
                'organizational_unit_id' => [
                    'required',
                    'uuid',
                    Rule::in(array_column($organizationAccess['options'], 'id')),
                ],
            ];
        }

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! is_string($value) || trim($value) === '') {
                        $fail('The name field is required.');
                    }
                },
            ],
            ...$organizationRules,
        ];
    }

    /**
     * @return array{name: string, organizational_unit_id?: string}
     */
    public function validatedCustomer(): array
    {
        /** @var array{name: string, organizational_unit_id?: string} $data */
        $data = $this->validated();

        $customer = [
            'name' => $data['name'],
        ];

        if ($this->isMethod('post')) {
            $customer['organizational_unit_id'] = $data['organizational_unit_id'];
        }

        return $customer;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->isMethod('post') || $this->filled('organizational_unit_id')) {
            return;
        }

        /** @var User|null $user */
        $user = $this->user();

        if ($user === null) {
            return;
        }

        $organizationAccess = app(CustomerOrganizationalUnitAccess::class)->forUser($user);

        if ($organizationAccess['organizationSelectionLocked'] && is_string($organizationAccess['resolvedOrganizationId'])) {
            $this->merge([
                'organizational_unit_id' => $organizationAccess['resolvedOrganizationId'],
            ]);
        }
    }
}
