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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // INTEGER PRIMARY KEY (Unique identifier, auto-incremented)
            $table->string('username')->unique(); // TEXT (Unique username)
            $table->string('email')->unique(); // TEXT (Unique email address)
            $table->string('password'); // TEXT (Hashed password)
            $table->string('first_name'); // TEXT
            $table->string('last_name'); // TEXT
            $table->timestamps(); // created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
