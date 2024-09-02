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
        Schema::table('license_plate', function (Blueprint $table) {
            $table->dropColumn('favorite'); // Remove the favorite column
            $table->renameColumn('recorded', 'seen'); // Rename the recorded column to seen
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('license_plate', function (Blueprint $table) {
            $table->boolean('favorite'); // Add the favorite column back
            $table->renameColumn('seen', 'recorded'); // Rename the seen column back to recorded
        });
    }
};