<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManager;

class UserSeeder extends Seeder
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
        $imagePath = public_path('images/profile/user-circle-duotone.png');

        // Define a set of nature-inspired colors
        $natureColors = [
            'rgba(172, 162, 83, 0.5)',
            'rgba(109, 128, 65, 0.5)',
            'rgba(187, 186, 166, 0.5)',
            'rgba(199, 170, 52, 0.5)',
            'rgba(130, 149, 86, 0.5)',
            'rgba(90, 96, 44, 0.5)',
            'rgba(140, 145, 111, 0.5)',
            'rgba(137, 165, 110, 0.5)',
            'rgba(176, 177, 140, 0.5)',
            'rgba(160, 145, 70, 0.5)',
            'rgba(133, 147, 90, 0.5)',
            'rgba(102, 160, 72, 0.5)',
            'rgba(184, 207, 218, 0.5)',
            'rgba(103, 139, 159, 0.5)',
            'rgba(191, 219, 232, 0.5)',
            'rgba(160, 194, 205, 0.5)',
            'rgba(79, 96, 106, 0.5)',
            'rgba(112, 139, 146, 0.5)',
            'rgba(169, 173, 176, 0.5)',
            'rgba(101, 125, 131, 0.5)',
            'rgba(158, 135, 104, 0.5)',
            'rgba(211, 185, 162, 0.5)',
            'rgba(182, 147, 123, 0.5)',
            'rgba(126, 103, 77, 0.5)',
            'rgba(212, 212, 212, 0.5)',
            'rgba(74, 78, 68, 0.5)',
            'rgba(114, 103, 87, 0.5)',
            'rgba(207, 191, 178, 0.5)',
            'rgba(186, 139, 121, 0.5)',
            'rgba(125, 118, 105, 0.5)'
        ];

        // Loop to create 10 users
        for ($i = 1; $i <= 10; $i++) {
            // Load the image
            $image = $manager->read($imagePath);

            // Randomly select a color from the set
            $selectedColor = $natureColors[array_rand($natureColors)];

            $centerX = 256;
            $centerY = 256;
            $radius = 208;

            $image->drawCircle($centerX, $centerY, function ($circle) use ($selectedColor, $radius) {
                $circle->radius($radius); // radius of circle in pixels
                $circle->background($selectedColor, 50); // background color
            });

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
