<?php

namespace Database\Seeders;

use App\Models\AreaFormCategory;
use App\Models\FileStatus;
use App\Models\ParameterOutlineCategory;
use App\Models\Roles;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'role_name' => 'Admin',
            ],
            [
                'role_name' => 'Coordinator',
            ],
            [
                'role_name' => 'Chairman',
            ],
            /* [
                'role_id' => 5,
                'role_name' => 'Unassigned'
            ], */
        ];
        foreach ($roles as $attributes) {
            Roles::firstOrCreate($attributes);
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
            User::firstOrCreate(
                ['user_id' => $attributes['user_id']],
                $attributes
            );
        }

        $parameterCategory = [
            ['category_name' => 'No Category'],
            ['category_name' => 'Systems - Inputs and Processes'],
            ['category_name' => 'Implementation'],
            ['category_name' => 'Outcome/s'],
        ];
        foreach ($parameterCategory as $attributes) {
            ParameterOutlineCategory::firstOrCreate($attributes);
        }

        $file_status = [
            ['status_name' => 'Approved'],
            ['status_name' => 'Pending'],
            ['status_name' => 'Rejected'],
        ];
        foreach ($file_status as $attributes) {
            FileStatus::firstOrCreate($attributes);
        }

        $area_forms_category = [
            ['category_name' => 'Program Performance Profile'],
            ['category_name' => 'Self-Survey'],
            ['category_name' => 'Compliance Report'],
        ];
        foreach ($area_forms_category as $attributes) {
            AreaFormCategory::firstOrCreate($attributes);
        }

    }
}
