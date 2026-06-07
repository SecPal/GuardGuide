<?php

namespace App\Http\Requests\Roles;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class SaveRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user instanceof User) {
            return false;
        }

        $role = $this->route('role');

        if ($role instanceof Role) {
            return $user->can('update', $role);
        }

        return $user->can('create', Role::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $role = $this->route('role');
        $existingRole = $role instanceof Role ? $role : null;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('roles', 'name')
                    ->where('guard_name', GuardGuideAccessCatalog::GUARD)
                    ->ignore($existingRole),
            ],
            'label' => ['required', 'string', 'max:255'],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => [
                'string',
                Rule::in(array_keys(GuardGuideAccessCatalog::permissions())),
            ],
        ];
    }

    /**
     * @return array{name: string, label: string, permissions: list<string>}
     */
    public function validatedRole(): array
    {
        /** @var array{name: string, label: string, permissions: list<string>} $data */
        $data = $this->validated();

        return $data;
    }
}
