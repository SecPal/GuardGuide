<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // The default `sessions` table from the Laravel starter kit stores `ip_address` and
        // `user_agent` columns and is intentionally omitted here so GuardGuide can honor its
        // baseline constraint of not persisting IP or user-agent data. The default session
        // driver is `file` (see config/session.php), so no table is required. Teams that opt
        // into the database session driver must add a tailored migration that excludes those
        // PII columns or replaces Laravel's DatabaseSessionHandler.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
    }
};
