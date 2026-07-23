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
     *
     * Legacy `is_admin` users are promoted by GuardGuideAccessSeeder itself
     * (guarded by the existence of the platform-admin role) so we do not
     * duplicate that logic here.
     */
    public function run(): void
    {
        $this->call(GuardGuideAccessSeeder::class);

        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        $testUser = User::where('email', 'test@example.com')->first();

        if ($testUser === null) {
            $testUser = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        if (! $testUser->hasVerifiedEmail()) {
            $testUser->markEmailAsVerified();
        }

        $testUser->assignRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR);
    }
}
