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
        Schema::create('sites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('customer_id')
                ->constrained()
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignUuid('organizational_unit_id')
                ->nullable()
                ->constrained('organizational_units')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['customer_id', 'name']);
            $table->index(['organizational_unit_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
