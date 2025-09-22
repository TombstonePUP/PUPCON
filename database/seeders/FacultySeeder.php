<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('faculties')->insert([
            [
                'first_name' => 'Alfeo',
                'last_name'  => 'Mendoza',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Alfeo-Mendoza.jpg',
                'faculty_image_path' => '/images/adfa-new/Alfeo-Mendoza.jpg',
            ],
            [
                'first_name' => 'Alfred',
                'last_name'  => 'Pagalilawan',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Alfred-Pagalilawan.jpg',
                'faculty_image_path' => '/images/adfa-new/Alfred-Pagalilawan.jpg',
            ],
            [
                'first_name' => 'Angeline',
                'last_name'  => 'Pabilona',
                'faculty_status' => 'Part-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Angeline-Pabilona.jpg',
                'faculty_image_path' => '/images/adfa-new/Angeline-Pabilona.jpg',
            ],
            [
                'first_name' => 'Anna Madonna',
                'last_name'  => 'Arellano',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => true,
                'faculty_image_name' => 'Anna-Madonna-Arellano.jpg',
                'faculty_image_path' => '/images/adfa-new/Anna-Madonna-Arellano.jpg',
            ],
            [
                'first_name' => 'Antonietta',
                'last_name'  => 'Canaon',
                'faculty_status' => 'Part-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Antonietta-Canaon.jpg',
                'faculty_image_path' => '/images/adfa-new/Antonietta-Canaon.jpg',
            ],
            [
                'first_name' => 'Cecilia R.',
                'last_name'  => 'Alagon',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Cecilia-R.-Alagon.jpg',
                'faculty_image_path' => '/images/adfa-new/Cecilia-R.-Alagon.jpg',
            ],
            [
                'first_name' => 'Dianne Marie',
                'last_name'  => 'Villas',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Dianne-Marie-Villas.jpg',
                'faculty_image_path' => '/images/adfa-new/Dianne-Marie-Villas.jpg',
            ],
            [
                'first_name' => 'Elias',
                'last_name'  => 'Austria',
                'faculty_status' => 'Part-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Elias-Austria.jpg',
                'faculty_image_path' => '/images/adfa-new/Elias-Austria.jpg',
            ],
            [
                'first_name' => 'Erwin',
                'last_name'  => 'Dela Cruz',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Erwin-Dela-Cruz.jpg',
                'faculty_image_path' => '/images/adfa-new/Erwin-Dela-Cruz.jpg',
            ],
            [
                'first_name' => 'Imelda',
                'last_name'  => 'Milanez',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Imelda-Milanez.jpg',
                'faculty_image_path' => '/images/adfa-new/Imelda-Milanez.jpg',
            ],
        ]);
    }
}
