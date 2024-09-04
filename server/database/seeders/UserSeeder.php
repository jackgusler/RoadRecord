<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManager;
use Intervention\Image\Geometry\Factories\CircleFactory;

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
        $imagePath = public_path('images/profile/user-circle-duotone-2.png');

        // Define a set of nature-inspired colors
        $natureColors = [
            'rgba(172, 162, 83)',
            'rgba(109, 128, 65)',
            'rgba(187, 186, 166)',
            'rgba(199, 170, 52)',
            'rgba(130, 149, 86)',
            'rgba(90, 96, 44)',
            'rgba(140, 145, 111)',
            'rgba(137, 165, 110)',
            'rgba(176, 177, 140)',
            'rgba(160, 145, 70)',
            'rgba(133, 147, 90)',
            'rgba(102, 160, 72)',
            'rgba(184, 207, 218)',
            'rgba(103, 139, 159)',
            'rgba(191, 219, 232)',
            'rgba(160, 194, 205)',
            'rgba(79, 96, 106)',
            'rgba(112, 139, 146)',
            'rgba(169, 173, 176)',
            'rgba(101, 125, 131)',
            'rgba(158, 135, 104)',
            'rgba(211, 185, 162)',
            'rgba(182, 147, 123)',
            'rgba(126, 103, 77)',
            'rgba(212, 212, 212)',
            'rgba(74, 78, 68)',
            'rgba(114, 103, 87)',
            'rgba(207, 191, 178)',
            'rgba(186, 139, 121)',
            'rgba(125, 118, 105)'
        ];

        // Loop to create 10 users
        for ($i = 1; $i <= 10; $i++) {
            // Randomly select a color from the set
            $selectedColor = $natureColors[array_rand($natureColors)];

            // Create a blank canvas with the selected background color
            $background = $manager->create(512, 512)->drawCircle(256, 256, function ($circle) use ($selectedColor) {
                $circle->radius(257);
                $circle->background($selectedColor);
            });

            // Load the profile image
            $profileImage = $manager->read($imagePath)->resize(512, 512);

            // Overlay the profile image on top of the background
            $background->place($profileImage, 'center', 0, 0, 50);

            // Convert the image to a blob
            $imageData = $background->toPng();

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
