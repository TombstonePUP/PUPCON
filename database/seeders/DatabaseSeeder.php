<?php

namespace Database\Seeders;
use App\Models\ActivityLog;
use App\Models\AreaFiles;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;
use App\Models\AreaParameters;
use App\Models\Areas;
use App\Models\ExhibitFiles;
use App\Models\ExhibitOutlines;
use App\Models\Exhibits;
use App\Models\Facilities;
use App\Models\FileStatus;
use App\Models\LocalTaskForce;
use App\Models\ParameterOutlineCategory;
use App\Models\ParameterOutlines;
use App\Models\ProgramGallery;
use App\Models\ProgramObjectives;
use App\Models\Programs;
use App\Models\Roles;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\UserAreaRoles;
use App\Models\UserProgramRoles;
use App\Models\UserRoles;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $roles = [
            [
                'role_id' => 1,
                'role_name' => 'Admin'
            ],
            [
                'role_id' => 2,
                'role_name' => 'Coordinator'
            ],
            [
                'role_id' => 3,
                'role_name' => 'Chairman'
            ],
            [
                'role_id' => 4,
                'role_name' => 'Accreditor'
            ],
            /* [
                'role_id' => 5,
                'role_name' => 'Unassigned'
            ], */
        ];
        foreach ($roles as $attributes) {
            Roles::factory()->create($attributes);
        }
        $users = [
            [
                'user_id' => 22222,
                'first_name' => 'Keith',
                'last_name' => 'Lee',
                'email' => 'keithlee@example.com',
                'role_id' => 3, // Chairman
                'password' => bcrypt('password@456'),
            ],
            [
                'user_id' => 11111,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'test@example.com',
                'role_id' => 1, // Admin
                'password' => bcrypt('password@123'),
            ],
            [
                'user_id' => 33333,
                'first_name' => 'Charles',
                'last_name' => 'Ilarde',
                'email' => 'ilardecharles@gmail.com',
                'role_id' => 3, // Chairman
                'password' => bcrypt('shiroe_1101101011'),
            ],
            [
                'user_id' => 44444,
                'first_name' => 'Jane',
                'last_name' => 'Doe',
                'email' => 'janedoe@accreditor.com',
                'role_id' => 4, // Accreditor
                'password' => bcrypt('accreditor@123'),
            ],
        ];
        foreach ($users as $attributes) {
            User::factory()->create($attributes);
        }
        // UserRoles::factory(10)->create();
        $programs = [
            [
                'program_id' => 1,
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Information Technology',
                'under_survey' => true,
                'color' => 'blue',
            ],
            [
                'program_id' => 2,
                'degree_type' => 'Bachelor of Arts',
                'program_name' => 'Communication',
                'under_survey' => true,
                'color' => 'red',
            ],
            [
                'program_id' => 3,
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Business Administration',
                'under_survey' => true,
                'color' => 'green',
            ],
            [
                'program_id' => 4,
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Psychology',
                'under_survey' => true,
                'color' => 'pink',
            ],
            [
                'program_id' => 5,
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Accountancy',
                'under_survey' => false,
                'color' => 'yellow',
            ],
        ];
        foreach ($programs as $attributes) {
            Programs::factory()->create($attributes);
        }
        ProgramGallery::factory(10)->create();
        $areas = [
            [
                'area_id' => 1,
                'program_id' => 1,
                'area_number' => 1,
                'area_name' => 'Mission, Goals, and Objectives',
            ],
            [
                'area_id' => 2,
                'program_id' => 1,
                'area_number' => 2,
                'area_name' => 'Faculty',
            ],
            [
                'area_id' => 3,
                'program_id' => 1,
                'area_number' => 3,
                'area_name' => 'Curriculum and Instruction',
            ],
            [
                'area_id' => 4,
                'program_id' => 1,
                'area_number' => 4,
                'area_name' => 'Support to Students',
            ],
            [
                'area_id' => 5,
                'program_id' => 1,
                'area_number' => 5,
                'area_name' => 'Research',
            ],
            [
                'area_id' => 6,
                'program_id' => 1,
                'area_number' => 6,
                'area_name' => 'Extension and Community Involvement',
            ],
            [
                'area_id' => 7,
                'program_id' => 1,
                'area_number' => 7,
                'area_name' => 'Library',
            ],
            [
                'area_id' => 8,
                'program_id' => 1,
                'area_number' => 8,
                'area_name' => 'Physical Plant and Facilities',
            ],
            [
                'area_id' => 9,
                'program_id' => 1,
                'area_number' => 9,
                'area_name' => 'Laboratories',
            ],
            [
                'area_id' => 10,
                'program_id' => 1,
                'area_number' => 10,
                'area_name' => 'Administration',
            ],
            [
                'area_id' => 11,
                'program_id' => 2,
                'area_number' => 1,
                'area_name' => 'Mission, Goals, and Objectives',
            ],
            [
                'area_id' => 12,
                'program_id' => 2,
                'area_number' => 2,
                'area_name' => 'Faculty',
            ],
            [
                'area_id' => 13,
                'program_id' => 2,
                'area_number' => 3,
                'area_name' => 'Curriculum and Instruction',
            ],
        ];
        foreach ($areas as $attributes) {
            Areas::factory()->create($attributes);
        }
        $userAreaRoles = [
            [
                'user_id' => 22222,
                'area_id' => 10,
            ],
            [
                'user_id' => 22222,
                'area_id' => 9,
            ],
            /* [
                'user_id' => 33333,
                'area_id' => 12,
            ],
            [
                'user_id' => 33333,
                'area_id' => 1,
            ], */
        ];
        foreach ($userAreaRoles as $attributes) {
            UserAreaRoles::factory()->create($attributes);
        }
        Facilities::factory(10)->create();
        ProgramObjectives::factory(10)->create();
        AreaParameters::factory(50)->create();
        $parameterCategory = [
            ['category_name' => 'No Category'],
            ['category_name' => 'Systems - Inputs and Processes'],
            ['category_name' => 'Implementation'],
            ['category_name' => 'Outcome/s']
        ];
        foreach ($parameterCategory as $attributes) {
            ParameterOutlineCategory::factory()->create($attributes);
        }
        ParameterOutlines::factory(500)->create();
        $file_status = [
            ['status_name' => 'Approved'],
            ['status_name' => 'Pending'],
            ['status_name' => 'Rejected'],
        ];
        foreach ($file_status as $attributes) {
            FileStatus::factory()->create($attributes);
        }
        $area_forms_category = [
            ['category_name' => 'Program Performance Profile'],
            ['category_name' => 'Self-Survey'],
            ['category_name' => 'Compliance Report']
        ];
        foreach ($area_forms_category as $attributes) {
            AreaFormCategory::factory()->create($attributes);
        }
        // AreaForms::factory(20)->create();
        // AreaFiles::factory(200)->create();
        Exhibits::factory(10)->create();
        // ExhibitOutlines::factory(10)->create();
        // ExhibitFiles::factory(10)->create();


        DB::table('faculties')->insert([
            [
                'first_name' => 'Alfeo',
                'last_name' => 'Mendoza',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Alfeo-Mendoza.jpg',
                'faculty_image_path' => '/images/adfa-new/Alfeo-Mendoza.jpg',
            ],
            [
                'first_name' => 'Alfred',
                'last_name' => 'Pagalilawan',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Alfred-Pagalilawan.jpg',
                'faculty_image_path' => '/images/adfa-new/Alfred-Pagalilawan.jpg',
            ],
            [
                'first_name' => 'Angeline',
                'last_name' => 'Pabilona',
                'faculty_status' => 'Part-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Angeline-Pabilona.jpg',
                'faculty_image_path' => '/images/adfa-new/Angeline-Pabilona.jpg',
            ],
            [
                'first_name' => 'Anna Madonna',
                'last_name' => 'Arellano',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => true,
                'faculty_image_name' => 'Anna-Madonna-Arellano.jpg',
                'faculty_image_path' => '/images/adfa-new/Anna-Madonna-Arellano.jpg',
            ],
            [
                'first_name' => 'Antonietta',
                'last_name' => 'Canaon',
                'faculty_status' => 'Part-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Antonietta-Canaon.jpg',
                'faculty_image_path' => '/images/adfa-new/Antonietta-Canaon.jpg',
            ],
            [
                'first_name' => 'Cecilia R.',
                'last_name' => 'Alagon',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Cecilia-R.-Alagon.jpg',
                'faculty_image_path' => '/images/adfa-new/Cecilia-R.-Alagon.jpg',
            ],
            [
                'first_name' => 'Dianne Marie',
                'last_name' => 'Villas',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Dianne-Marie-Villas.jpg',
                'faculty_image_path' => '/images/adfa-new/Dianne-Marie-Villas.jpg',
            ],
            [
                'first_name' => 'Elias',
                'last_name' => 'Austria',
                'faculty_status' => 'Part-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Elias-Austria.jpg',
                'faculty_image_path' => '/images/adfa-new/Elias-Austria.jpg',
            ],
            [
                'first_name' => 'Erwin',
                'last_name' => 'Dela Cruz',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Erwin-Dela-Cruz.jpg',
                'faculty_image_path' => '/images/adfa-new/Erwin-Dela-Cruz.jpg',
            ],
            [
                'first_name' => 'Imelda',
                'last_name' => 'Milanez',
                'faculty_status' => 'Full-Time',
                'program_id' => 1,
                'program_coordinator' => false,
                'faculty_image_name' => 'Imelda-Milanez.jpg',
                'faculty_image_path' => '/images/adfa-new/Imelda-Milanez.jpg',
            ],
        ]);

    }
}
