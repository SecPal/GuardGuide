<?php

namespace Database\Factories;

use App\Enums\OrganizationalUnitType;
use App\Models\OrganizationalUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrganizationalUnit>
 */
class OrganizationalUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(OrganizationalUnitType::values()),
            'name' => fake()->company().' '.fake()->randomElement(['Operations', 'Services', 'Security']),
            'parent_id' => null,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function root(): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => null,
        ]);
    }

    public function childOf(OrganizationalUnit $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->getKey(),
        ]);
    }
}
