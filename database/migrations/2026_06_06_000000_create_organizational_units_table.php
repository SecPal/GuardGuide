<?php

use App\Enums\OrganizationalUnitType;
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
        Schema::create('organizational_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', OrganizationalUnitType::values());
            $table->string('name');
            $table->foreignUuid('parent_id')
                ->nullable()
                ->constrained('organizational_units')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['parent_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizational_units');
    }
};
