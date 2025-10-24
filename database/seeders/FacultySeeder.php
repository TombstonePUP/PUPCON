<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bsitFaculties = [
            'Elias Austria',
            'Alfeo Mendoza',
            'Alfred Pagalilawan',
        ];

        $psychFaculties = [
            'Angeline Pabilona',
            'Anna Madonna Arellano',
            'Ian Llenares'
        ];

        $fullTime = [
            'Elias Austria',
            'Alfred Pagalilawan',
            'Rogie Delena',
            'Peter Biason',
            'Lemuel Damole',
            'Ronette Espiritu',
            'Anna Madonna Arellano',
            'Cecille R. Alagon'
        ];

        $directory = public_path('images/adfa-new/faculty'); // Folder location
        $files = File::files($directory); // Get all files

        $faculties = [];

        foreach ($files as $file) {
            $fileName = $file->getFilename(); // e.g. "Jose-Rizal.jpg"
            $extension = $file->getExtension();

            // Remove extension and split by hyphen
            $nameParts = explode('-', pathinfo($fileName, PATHINFO_FILENAME));

            if (count($nameParts) >= 2) {
                $lastName = array_pop($nameParts);
                $firstName = implode(' ', $nameParts);
            } else {
                $firstName = $nameParts[0];
                $lastName = '';
            }

            $fullName = Str::title(trim(str_replace('-', ' ', "{$firstName} {$lastName}")));

            // Determine program based on name
            if (in_array($fullName, $psychFaculties)) {
                $programId = 4; // Psychology
            } elseif (in_array($fullName, $bsitFaculties)) {
                $programId = 1; // BSIT
            } else {
                $programId = 9; // Unassigned or Other Program
            }

            if (in_array($fullName, $fullTime)) {
                $facultyStatus = 'Full Time';
            } else {
                $facultyStatus = 'Part Time';
            }

            $faculties[] = [
                'first_name' => Str::title(str_replace('-', ' ', $firstName)),
                'last_name' => Str::title(str_replace('-', ' ', $lastName)),
                'faculty_status' => $facultyStatus,
                'program_id' => $programId,
                'program_coordinator' => false,
                'faculty_image_name' => $fileName,
                'faculty_image_path' => '/images/adfa-new/faculty/' . $fileName,
            ];
        }


        // Insert all entries at once
        DB::table('faculties')->insert($faculties);
    }
}
