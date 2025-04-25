<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\AreaFiles;
use App\Models\AreaParameters;
use App\Models\Areas;
use App\Models\ExhibitFiles;
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

        User::factory(10)->create();
        LocalTaskForce::factory(10)->create();
        ActivityLog::factory(10)->create();
        Roles::factory(5)->create();
        UserRoles::factory(10)->create();
        Areas::factory(10)->create();
        UserAreaRoles::factory(10)->create();
        Programs::factory(10)->create();
        UserProgramRoles::factory(10)->create();
        Facilities::factory(10)->create();
        ProgramObjectives::factory(10)->create();
        AreaParameters::factory(10)->create();
        ParameterOutlineCategory::factory(5)->create();
        ParameterOutlines::factory(10)->create();
        FileStatus::factory(3)->create();
        AreaFiles::factory(10)->create();
        Exhibits::factory(10)->create();
        ExhibitFiles::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
