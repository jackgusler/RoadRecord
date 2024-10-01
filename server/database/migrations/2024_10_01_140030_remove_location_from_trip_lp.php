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
        Schema::table('trip_lp', function (Blueprint $table) {
            $table->dropColumn('location_during_recording');
            $table->dropColumn('recorded_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trip_lp', function (Blueprint $table) {
            $table->string('location_during_recording')->nullable();
            $table->timestamp('recorded_at')->nullable();
        });
    }
};