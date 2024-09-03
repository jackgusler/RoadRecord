<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class LicensePlateCSVSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path to the CSV file
        $csvFilePath = public_path('csv/us-license-plates-updated.csv');

        // Check if the file exists
        if (!File::exists($csvFilePath)) {
            $this->command->error("CSV file not found at path: $csvFilePath");
            return;
        }

        // Read the CSV file
        $csvData = array_map('str_getcsv', file($csvFilePath));

        // Get the header row
        $header = array_shift($csvData);

        // Loop through the CSV data and insert into the database
        foreach ($csvData as $row) {
            // Check if the number of elements in the header and row match
            if (count($header) !== count($row)) {
                $this->command->error("CSV row does not match header length: " . implode(',', $row));
                continue;
            }

            // Combine the header with the row data
            $rowData = array_combine($header, $row);

            // Get the image
            $imagePath = public_path('images/plates/' . $rowData['state'] . '/' . $rowData['plate_img']);

            // Check if the image file exists
            if (!File::exists($imagePath)) {
                $this->command->error("Image file not found at path: $imagePath");
                continue;
            }

            // Read the image file
            $imageContent = File::get($imagePath);

            // Insert the data into the licenseplate table
            DB::table('license_plate')->insert([
                'state' => $rowData['state'],
                'plate_title' => $rowData['plate_title'],
                'plate_name' => $rowData['plate_img'],
                'plate_img' => $imageContent,
                'seen' => false, // Default value for seen
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('License plates seeded successfully.');
    }
}