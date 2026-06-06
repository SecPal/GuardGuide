<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserCustomerAssignment>
 */
class UserCustomerAssignmentFactory extends Factory
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
            'customer_id' => Customer::factory(),
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->getKey(),
        ]);
    }

    public function forCustomer(Customer $customer): static
    {
        return $this->state(fn (array $attributes) => [
            'customer_id' => $customer->getKey(),
        ]);
    }
}
