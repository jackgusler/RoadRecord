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
        Schema::create('license_plate', function (Blueprint $table) {
            $table->id(); // INTEGER PRIMARY KEY (Unique identifier, auto-incremented)
            $table->string('state'); // TEXT (State postal code abbreviation)
            $table->string('plate_title'); // TEXT (Title of the plate)
            $table->string('plate_img'); // TEXT (Filename of the local plate image)
            $table->string('source_img'); // TEXT (URL or path of the online image at the time of collection)
            $table->boolean('favorite'); // BOOLEAN (Whether the user favorited this plate)
            $table->boolean('recorded'); // BOOLEAN (Whether the user has seen this plate)
            $table->timestamps(); // created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_plate');
    }
};
