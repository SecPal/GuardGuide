<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Site>
 */
class SiteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'organizational_unit_id' => null,
            'name' => fake()->company().' '.fake()->randomElement(['Campus', 'Facility', 'Site']),
        ];
    }

    public function forCustomer(Customer $customer): static
    {
        return $this->state(fn (array $attributes) => [
            'customer_id' => $customer->getKey(),
        ]);
    }

    public function managedBy(OrganizationalUnit $unit): static
    {
        return $this->state(fn (array $attributes) => [
            'organizational_unit_id' => $unit->getKey(),
        ]);
    }

    public function withoutOrganizationalUnit(): static
    {
        return $this->state(fn (array $attributes) => [
            'organizational_unit_id' => null,
        ]);
    }
}
