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
        Schema::create('user_organizational_unit_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')
                ->constrained(table: 'users', indexName: 'user_unit_assignment_user_fk')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignUuid('organizational_unit_id');
            $table->foreign('organizational_unit_id', 'user_unit_assignment_unit_fk')
                ->references('id')
                ->on('organizational_units')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();

            $table->unique(['user_id', 'organizational_unit_id'], 'user_unit_assignment_unique');
            $table->index('organizational_unit_id', 'user_unit_assignment_unit_idx');
        });

        Schema::create('user_customer_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')
                ->constrained(table: 'users', indexName: 'user_customer_assignment_user_fk')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignUuid('customer_id')
                ->constrained(indexName: 'user_customer_assignment_customer_fk')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();

            $table->unique(['user_id', 'customer_id']);
            $table->index('customer_id');
        });

        Schema::create('user_site_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')
                ->constrained(table: 'users', indexName: 'user_site_assignment_user_fk')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignUuid('site_id')
                ->constrained(table: 'sites', indexName: 'user_site_assignment_site_fk')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();

            $table->unique(['user_id', 'site_id']);
            $table->index('site_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_site_assignments');
        Schema::dropIfExists('user_customer_assignments');
        Schema::dropIfExists('user_organizational_unit_assignments');
    }
};
