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
use App\Models\ProgramObjectives;
use App\Models\Programs;
use App\Models\Roles;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\UserAreaRoles;
use App\Models\UserProgramRoles;
use App\Models\UserRoles;
use Illuminate\Database\Seeder;
Use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create();

        User::factory()->create([
            'user_id' => 11111,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'test@example.com',
            'password' => bcrypt('password@123'),
        ]);
        User::factory(10)->create();
        ActivityLog::factory(100)->create();
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
                'role_name' => 'Area Chair'
            ],
            [
                'role_id' => 4,
                'role_name' => 'Chair Assistant'
            ],
            [
                'role_id' => 5,
                'role_name' => 'Content Manager'
            ],
        ];
        foreach ($roles as $attributes) {
            Roles::factory()->create($attributes);
        }
        UserRoles::factory()->create([
            'user_id' => 11111,
            'role_id' => 1,
        ]);
        UserRoles::factory(10)->create();
        Programs::factory()->create([
            'program_id' => 1,
            'program_name' => 'Sample Program',
            'program_description' => 'This is a sample program for testing purposes.',
        ]);
        Programs::factory(10)->create();
        UserProgramRoles::factory()->create([
            'user_id' => 11111,
            'program_id' => 1, // Assuming program_id 1 is for a specific program
        ]);
        UserProgramRoles::factory(10)->create();
        Areas::factory(20)->create();
        UserAreaRoles::factory(10)->create();
        LocalTaskForce::factory(10)->create();
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
        ParameterOutlines::factory(80)->create();
        $file_status = [
            ['status_name' => 'Approved'],
            ['status_name' => 'Pending'],
            ['status_name' => 'Rejected'],
        ];
        foreach ($file_status as $attributes) {
            FileStatus::factory()->create($attributes);
        }
        AreaFormCategory::factory(3)->create();
        AreaForms::factory(50)->create();
        AreaFiles::factory(100)->create();
        Exhibits::factory(10)->create();
        ExhibitOutlines::factory(10)->create();
        ExhibitFiles::factory(10)->create();

    }
}
