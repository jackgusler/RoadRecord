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
        Schema::create('user_lp', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id'); // INTEGER (Foreign key to User table)
            $table->unsignedBigInteger('license_plate_id'); // INTEGER (Foreign key to LicensePlate table)
            $table->timestamps(); // created_at and updated_at timestamps

            // Composite primary key
            $table->primary(['user_id', 'license_plate_id']);

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('license_plate_id')->references('id')->on('license_plate')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_lp');
    }
};
