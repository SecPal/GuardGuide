<?php

namespace App\Http\Requests\OrganizationalUnits;

use App\Enums\OrganizationalUnitType;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveOrganizationalUnitRequest extends FormRequest
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
        return [
            'type' => ['required', Rule::enum(OrganizationalUnitType::class)],
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
            'parent_id' => [
                'nullable',
                'uuid',
                Rule::exists('organizational_units', 'id')->whereNull('deleted_at'),
            ],
            'sort_order' => ['required', 'integer', 'min:0', 'max:2147483647'],
        ];
    }

    /**
     * @return array{type: string, name: string, parent_id: string|null, sort_order: int}
     */
    public function validatedUnit(): array
    {
        /** @var array{type: string, name: string, parent_id?: string|null, sort_order: int|string} $data */
        $data = $this->validated();

        return [
            'type' => $data['type'],
            'name' => $data['name'],
            'parent_id' => $data['parent_id'] ?? null,
            'sort_order' => (int) $data['sort_order'],
        ];
    }
}
