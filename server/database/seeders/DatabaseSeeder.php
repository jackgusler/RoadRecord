<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Truncate the users table
        DB::table('users')->truncate();

        // Create new manager instance with desired driver
        $manager = ImageManager::gd();

        // Load the default profile image
        $imagePath = public_path('images/user-circle-duotone.png');

        // Define a set of nature-inspired colors
        $natureColors = [
            ['red' => 34, 'green' => 139, 'blue' => 34],   // ForestGreen
            ['red' => 60, 'green' => 179, 'blue' => 113],  // MediumSeaGreen
            ['red' => 32, 'green' => 178, 'blue' => 170],  // LightSeaGreen
            ['red' => 107, 'green' => 142, 'blue' => 35],  // OliveDrab
            ['red' => 46, 'green' => 139, 'blue' => 87],   // SeaGreen
            ['red' => 0, 'green' => 128, 'blue' => 128],   // Teal
            ['red' => 85, 'green' => 107, 'blue' => 47],   // DarkOliveGreen
        ];

        // Loop to create 10 users
        for ($i = 1; $i <= 10; $i++) {
            // Load the image
            $image = $manager->read($imagePath);

            // Randomly select a color from the set
            $selectedColor = $natureColors[array_rand($natureColors)];

            // Apply the selected color to the image
            $image->colorize($selectedColor['red'], $selectedColor['green'], $selectedColor['blue']);

            // Convert the image to a blob
            $imageData = (string) $image->toPng();

            // Create the user
            User::factory()->create([
                'username' => 'user' . $i,
                'email' => 'user' . $i . '@example.com',
                'password' => bcrypt('password'), // Ensure you hash the password
                'first_name' => 'Test',
                'last_name' => 'User',
                'profile_img' => $imageData, // Store binary data
            ]);
        }
    }
}
