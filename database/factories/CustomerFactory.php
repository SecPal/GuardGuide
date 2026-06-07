<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\OrganizationalUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organizational_unit_id' => OrganizationalUnit::factory()->company(),
            'name' => fake()->company(),
        ];
    }
}
