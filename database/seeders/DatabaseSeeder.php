<?php

namespace Database\Seeders;

use App\Models\AccreditationLevels;
use App\Models\AreaFormCategory;
use App\Models\Areas;
use App\Models\AreaParameters;
use App\Models\Exhibits;
use App\Models\Facilities;
use App\Models\FileStatus;
use App\Models\ParameterOutlineCategory;
use App\Models\ProgramGallery;
use App\Models\ProgramObjectives;
use App\Models\Programs;
use App\Models\ParameterOutlines;
use App\Models\Roles;
use App\Models\User;
use App\Models\ContentPages;
use App\Models\UserAreaRoles;
use App\Models\CampusGallery;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

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
                'role_name' => 'Admin'
            ],
            [
                'role_name' => 'Coordinator'
            ],
            [
                'role_name' => 'Chairman'
            ],
            /* [
                'role_id' => 5,
                'role_name' => 'Unassigned'
            ], */
        ];
        foreach ($roles as $attributes) {
            Roles::factory()->create($attributes);
        }
        $role1 = Roles::where('role_name', 'Admin')->first();
        $role2 = Roles::where('role_name', 'Coordinator')->first();
        $role3 = Roles::where('role_name', 'Chairman')->first();
        $role4 = Roles::where('role_name', 'Accreditor')->first();
        $users = [
            [
                'user_id' => 11111,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'johndoe@admin.com',
                'role_id' => $role1->role_id, // Admin
                'password' => bcrypt('admin@123'),
            ],
            [
                'user_id' => 22222,
                'first_name' => 'Keith',
                'last_name' => 'Lee',
                'email' => 'keithlee@chairman.com',
                'role_id' => $role3->role_id, // Chairman
                'password' => bcrypt('chairman@123'),
            ],
        ];
        foreach ($users as $attributes) {
            User::factory()->create($attributes);
        }

         $exhibits = [
            ['exhibit_name' => 'University Charter', 'container' => false],
            ['exhibit_name' => 'Academic Council Resolutions', 'container' => true],
            ['exhibit_name' => 'Strategic Development Plan', 'container' => false],
            ['exhibit_name' => 'Faculty Manual', 'container' => false],
            ['exhibit_name' => 'Student Handbook', 'container' => false],
        ];
        foreach ($exhibits as $attributes) {
            Exhibits::create($attributes);
        }
        $programs = [
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Information Technology',
                'program_description' => 'The BSIT program focuses on computer utilization and software to plan, install, customize, operate, manage, and maintain IT infrastructure. It deals with designing computer-based information systems for real-world business solutions.',
                'under_survey' => true,
                'color' => 'blue',
                'program_image_path' => '/images/programs/it.png',
            ],
            [
                'degree_type' => 'Bachelor of Arts',
                'program_name' => 'Communication',
                'program_description' => 'The ABComm program aims to develop skills in various forms of communication, including media literacy and critical thinking, preparing students for the dynamic media landscape.',
                'under_survey' => false,
                'color' => 'red',
                'program_image_path' => '/images/programs/comm.png',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Business Administration',
                'program_description' => 'The BSBA program provides a comprehensive understanding of business principles, covering management, marketing, finance, and entrepreneurship.',
                'under_survey' => false,
                'color' => 'green',
                'program_image_path' => '/images/programs/bsba.png',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Psychology',
                'program_description' => 'The BS Psychology program focuses on the scientific study of human behavior and mental processes, providing a strong foundation in psychological theories and research.',
                'under_survey' => true,
                'color' => 'pink',
                'program_image_path' => '/images/programs/psych.png',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Accountancy',
                'under_survey' => false,
                'program_description' => 'The BSA program prepares students for professional positions in public, private, or government accounting, qualifying them for CPA licensure.',
                'color' => 'yellow',
                'program_image_path' => '/images/programs/accountancy.png',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Entrepreneurship',
                'under_survey' => false,
                'program_description' => 'The BS Entrepreneurship program provides an in-depth understanding of new venture operations, equipping students with entrepreneurial spirit and leadership qualities.',
                'color' => 'lightgreen',
                'program_image_path' => '/images/programs/entrepreneurship.png',
            ],
        ];
        foreach ($programs as $attributes) {
            Programs::factory()->create($attributes);
        }

        $program1 = Programs::where('program_name', 'Information Technology')->first();
        $program4 = Programs::where('program_name', 'Psychology')->first();

        // Hero Carousel Images
        $campusGallery = [
            [
                'image_name' => 'campus-main.png',
                'image_path' => '/images/landing/1.png',
                'carousel' => true,
                'description' => 'Main Campus Building of PUP San Juan',
            ],
            [
                'image_name' => 'ceremony.jpg',
                'image_path' => '/images/ceremony.jpg',
                'carousel' => true,
                'description' => 'Ceremonial Signing with Research Synergy Foundation',
            ],
            [
                'image_name' => 'street-sj.png',
                'image_path' => '/images/landing/street-sj.png',
                'carousel' => true,
                'description' => 'Street View entrance of the campus',
            ],
        ];
        foreach ($campusGallery as $attributes) {
            CampusGallery::create($attributes);
        }

        $levels = [
            [
                'program_id' => $program1->program_id,
                'level' => 2,
                'remarks' => 'Passed',
                'is_active' => false,
                'survey_date' => '2022-05-15',
            ],
            [
                'program_id' => $program1->program_id,
                'level' => 3,
                'remarks' => 'Ongoing Survey',
                'is_active' => true,
                'survey_date' => '2024-03-20',
            ],
            [
                'program_id' => $program4->program_id,
                'level' => 3,
                'remarks' => 'Ongoing Survey',
                'is_active' => true,
                'survey_date' => '2024-04-15',
            ],
        ];
        foreach ($levels as $attributes) {
            AccreditationLevels::factory()->create($attributes);
        }

        $level2 = AccreditationLevels::where('program_id', $program1->program_id)
            ->where('level', 3)->first();
        $level3 = AccreditationLevels::where('program_id', $program4->program_id)
            ->where('level', 3)->first();

        $areas = [
            [
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 1,
                'area_name' => 'Mission, Goals, and Objectives',
                'area_description' => 'Everything in the Institution is justified only to the extent that it realizes its vision and mission. Base of all operations.',
                'area_image_path' => '/images/area/avr.png',
            ],
            [
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 2,
                'area_name' => 'Faculty',
                'area_description' => 'The standard of the program is measured by the qualifications and professional expertise of its faculty members.',
                'area_image_path' => '/images/area/com.png',
            ],
            [
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 3,
                'area_name' => 'Curriculum and Instruction',
                'area_description' => 'Curriculum and instruction seek to research, develop, and implement changes that enhance student achievement.',
                'area_image_path' => '/images/area/conf.png',
            ],
            [
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 4,
                'area_name' => 'Support to Students',
                'area_description' => 'Designed to assist the student to attain his/her maximum potential and become a worthy contributor to society.',
                'area_image_path' => '/images/area/court.png',
            ],
        ];
        foreach ($areas as $attributes) {
            Areas::factory()->create($attributes);
        }

        $user1 = User::where('user_id', 22222)->first();
        $areaRole1 = Areas::where('area_name', 'Faculty')->first();
        
        if ($areaRole1) {
            UserAreaRoles::factory()->create([
                'user_id' => $user1->user_id,
                'area_id' => $areaRole1->area_id,
            ]);
        }

        $objectives = [
            [
                'program_id' => $program1->program_id,
                'objective_title' => 'Core Competency',
                'objective_description' => "Develop high-level technical skills in information technology and software development.",
            ],
            [
                'program_id' => $program4->program_id,
                'objective_title' => 'Behavioral Analysis',
                'objective_description' => "Equip students with the ability to conduct scientific research in human behavior.",
            ],
        ];
        foreach ($objectives as $attributes) {
            ProgramObjectives::factory()->create($attributes);
        }

        $area1 = Areas::where('area_number', 1)->first();
        $areaparameter = [
            [
                'area_id' => $area1->area_id,
                'parameter_name' => 'A',
                'parameter_description' => 'Statement of Vision, Mission, Goals, and Objectives'
            ],
        ];
        foreach ($areaparameter as $attributes) {
            AreaParameters::factory()->create($attributes);
        }

        $parameterCategory = [
            ['category_name' => 'Systems - Inputs and Processes'],
            ['category_name' => 'Implementation'],
            ['category_name' => 'Outcome/s'],
        ];
        foreach ($parameterCategory as $attributes) {
            ParameterOutlineCategory::factory()->create($attributes);
        }

        $file_status = [
            ['status_name' => 'Approved'],
            ['status_name' => 'Pending'],
            ['status_name' => 'Rejected'],
        ];
        foreach ($file_status as $attributes) {
            FileStatus::factory()->create($attributes);
        }

        $content = [
            [
                'page' => 'Welcome',
                'title' => 'PUP San Juan Quality Assurance',
                'subtitle' => 'Commitment to Excellence in Education',
                'description' => 'Providing top-tier polytechnic education through rigorous accreditation and continuous improvement.',
                'video_link' => 'https://www.youtube.com/embed/9ypv1kOj7CU',
                'video_title' => 'PUP San Juan AVP',
                'video_description' => 'A glimpse into the life and achievements of our campus.',
                'director_name' => 'Prof. Cecilia Reyes-Alagon',
                'director_message' => 'Welcome to our campus, where we shape the future leaders of the nation.',
                'director_image_path' => '/images/adfa-new/faculty/Cecilia-Reyes-Alagon.jpg',
            ],
            ['page' => 'About'],
            ['page' => 'History'],
            ['page' => 'Vision, Mission & Goals'],
        ];
        foreach ($content as $attributes) {
            ContentPages::factory()->create($attributes);
        }
    }
}
