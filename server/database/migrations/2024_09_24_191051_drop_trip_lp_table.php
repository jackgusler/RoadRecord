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
        Schema::dropIfExists('trip_lp');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('trip_lp', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trip_id');
            $table->unsignedBigInteger('license_plate_id');
            $table->dateTime('recorded_at');
            $table->string('location_during_recording');
            $table->timestamps();

            $table->foreign('trip_id')->references('id')->on('trip')->onDelete('cascade');
            $table->foreign('license_plate_id')->references('id')->on('license_plate')->onDelete('cascade');
        });
    }
};