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
        // Drop the existing table
        Schema::dropIfExists('license_plate');

        // Create the table with the new schema
        Schema::create('license_plate', function (Blueprint $table) {
            $table->id(); // INTEGER PRIMARY KEY (Unique identifier, auto-incremented)
            $table->string('state'); // TEXT (State postal code abbreviation)
            $table->string('plate_title'); // TEXT (Title of the plate)
            $table->string('plate_name'); // TEXT (Filename of the local plate image)
            $table->binary('plate_img'); // BLOB (BLOB of the plate image)
            $table->boolean('seen')->default(false); // BOOLEAN (Whether the user has seen this plate)
            $table->timestamps(); // created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the table
        Schema::dropIfExists('license_plate');

        // Recreate the original table
        Schema::create('license_plate', function (Blueprint $table) {
            $table->id(); // INTEGER PRIMARY KEY (Unique identifier, auto-incremented)
            $table->string('state'); // TEXT (State postal code abbreviation)
            $table->string('plate_title'); // TEXT (Title of the plate)
            $table->string('plate_img'); // TEXT (Filename of the local plate image)
            $table->boolean('seen')->default(false); // BOOLEAN (Whether the user has seen this plate)
            $table->timestamps(); // created_at and updated_at timestamps
        });
    }
};