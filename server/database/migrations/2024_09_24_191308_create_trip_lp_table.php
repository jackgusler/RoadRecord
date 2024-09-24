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
        Schema::create('trip_lp', function (Blueprint $table) {
            $table->id(); // INTEGER PRIMARY KEY (Unique identifier, auto-incremented)
            $table->unsignedBigInteger('trip_id'); // INTEGER (Foreign key to Trip table)
            $table->unsignedBigInteger('user_id'); // INTEGER (Foreign key to User table)
            $table->unsignedBigInteger('license_plate_id'); // INTEGER (Foreign key to LicensePlate table)
            $table->dateTime('recorded_at'); // DATETIME (Timestamp when the license plate was recorded)
            $table->string('location_during_recording'); // TEXT (Location details where the plate was seen during the trip)
            $table->timestamps(); // created_at and updated_at timestamps

            // Foreign key constraints
            $table->foreign('trip_id')->references('id')->on('trip')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Foreign key to User table
            $table->foreign('license_plate_id')->references('id')->on('license_plate')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_lp');
    }
};