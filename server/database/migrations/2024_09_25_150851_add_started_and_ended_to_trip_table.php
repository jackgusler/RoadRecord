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
        Schema::table('trip', function (Blueprint $table) {
            $table->boolean('started')->default(false);
            $table->boolean('ended')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trip', function (Blueprint $table) {
            $table->dropColumn('started');
            $table->dropColumn('ended');
        });
    }
};