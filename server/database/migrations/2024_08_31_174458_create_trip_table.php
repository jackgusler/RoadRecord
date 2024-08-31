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
        Schema::create('trip', function (Blueprint $table) {
            $table->id(); // INTEGER PRIMARY KEY (Unique identifier, auto-incremented)
            $table->unsignedBigInteger('user_id'); // INTEGER (Foreign key to link the trip to a user)
            $table->string('starting_location'); // TEXT (Starting location of the trip)
            $table->string('ending_location'); // TEXT (Ending location of the trip)
            $table->integer('time'); // INTEGER (Duration of the trip in minutes or seconds)
            $table->dateTime('starting_date'); // DATETIME (Start date and time of the trip)
            $table->dateTime('ending_date'); // DATETIME (End date and time of the trip)
            $table->string('name'); // TEXT (Name of the trip)
            $table->boolean('stillDriving'); // BOOLEAN (Whether the trip is ongoing)
            $table->timestamps(); // created_at and updated_at timestamps

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip');
    }
};
