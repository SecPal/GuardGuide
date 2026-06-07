<?php

namespace Database\Seeders;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * The default test user is only intended for local development and the test
     * suite, so we never create it in other environments to avoid shipping a
     * known account to staging or production bootstrap runs.
     */
    public function run(): void
    {
        $this->call(GuardGuideAccessSeeder::class);

        User::query()
            ->where('is_admin', true)
            ->cursor()
            ->each(function (User $user): void {
                $user->assignRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR);
                $user->forceFill(['is_admin' => false])->save();
            });

        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ])->assignRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR);
    }
}
