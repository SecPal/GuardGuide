<?php

namespace App\Http\Requests\Sites;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Site;
use App\Models\User;
use App\Services\AssignmentAccessScope;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class SaveSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user instanceof User) {
            return false;
        }

        $site = $this->route('site');

        if ($site instanceof Site) {
            return $user->can('update', $site);
        }

        return $user->can(GuardGuideAccessCatalog::SITES_CREATE);
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
            'customer_id' => [
                'required',
                'uuid',
                'exists:customers,id',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! is_string($value) || ! $this->customerIsWritable($value)) {
                        $fail('The selected customer is not available in your access scope.');
                    }
                },
            ],
            'organizational_unit_id' => [
                'nullable',
                'uuid',
                'exists:organizational_units,id',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (($value === null || $value === '') || (is_string($value) && $this->organizationalUnitIsReadable($value))) {
                        return;
                    }

                    $fail('The selected organizational unit is not available in your access scope.');
                },
            ],
        ];
    }

    /**
     * @return array{customer_id: string, organizational_unit_id: string|null, name: string}
     */
    public function validatedSite(): array
    {
        /** @var array{customer_id: string, organizational_unit_id?: string|null, name: string} $data */
        $data = $this->validated();

        return [
            'customer_id' => $data['customer_id'],
            'organizational_unit_id' => ($data['organizational_unit_id'] ?? null) ?: null,
            'name' => $data['name'],
        ];
    }

    private function customerIsWritable(string $customerId): bool
    {
        /** @var User $user */
        $user = $this->user();

        return app(AssignmentAccessScope::class)
            ->writableCustomers($user)
            ->whereKey($customerId)
            ->exists();
    }

    private function organizationalUnitIsReadable(string $organizationalUnitId): bool
    {
        /** @var User $user */
        $user = $this->user();

        return app(AssignmentAccessScope::class)
            ->readableOrganizationalUnits($user)
            ->whereKey($organizationalUnitId)
            ->exists();
    }
}
