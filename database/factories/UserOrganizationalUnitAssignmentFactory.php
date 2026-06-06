<?php

namespace Database\Factories;

use App\Models\OrganizationalUnit;
use App\Models\User;
use App\Models\UserOrganizationalUnitAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserOrganizationalUnitAssignment>
 */
class UserOrganizationalUnitAssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'organizational_unit_id' => OrganizationalUnit::factory(),
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->getKey(),
        ]);
    }

    public function forOrganizationalUnit(OrganizationalUnit $unit): static
    {
        return $this->state(fn (array $attributes) => [
            'organizational_unit_id' => $unit->getKey(),
        ]);
    }
}
