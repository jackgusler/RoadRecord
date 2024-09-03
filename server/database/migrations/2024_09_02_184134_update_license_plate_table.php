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
            $table->dropColumn('source_img'); // Remove the source_img column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('license_plate', function (Blueprint $table) {
            $table->string('source_img'); // Add the source_img column back
        });
    }
};