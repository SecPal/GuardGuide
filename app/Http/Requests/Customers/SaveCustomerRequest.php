<?php

namespace App\Http\Requests\Customers;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class SaveCustomerRequest extends FormRequest
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
        ];
    }

    /**
     * @return array{name: string}
     */
    public function validatedCustomer(): array
    {
        /** @var array{name: string} $data */
        $data = $this->validated();

        return [
            'name' => $data['name'],
        ];
    }
}
