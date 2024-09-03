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
        Schema::table('user_lp', function (Blueprint $table) {
            $table->boolean('seen')->default(false); // Add the seen column with a default value
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_lp', function (Blueprint $table) {
            $table->dropColumn('seen'); // Drop the seen column if the migration is rolled back
        });
    }
};