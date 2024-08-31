<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Truncate the users table
        DB::table('users')->truncate();

        // Read the image file and convert it to binary data
        $imagePath = public_path('images/user-circle-duotone.png');
        $imageData = File::get($imagePath);

        // Seed the users table
        User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password'), // Ensure you hash the password
            'first_name' => 'Test',
            'last_name' => 'User',
            'profile_img' => $imageData, // Store binary data
        ]);
    }
}