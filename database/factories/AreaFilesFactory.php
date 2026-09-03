<?php

namespace Database\Factories;

use App\Models\AreaFiles;
use App\Models\FileStatus;
use App\Models\ParameterOutlines;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AreaFiles>
 */
class AreaFilesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $parameterOutlines = ParameterOutlines::inRandomOrder()->first();
        $fileStatus = FileStatus::inRandomOrder()->first();
        $user = User::inRandomOrder()->first();

        return [
            // 'area_file_id' => $this->faker->unique()->randomNumber(),
            'parameter_outline_id' => $parameterOutlines->parameter_outline_id,
            /* 'file_name' => $this->faker->word(),
            'file_path' => $this->faker->filePath(), */
            'uploaded_by' => $user->user_id,
            // 'uploaded_at' => $this->faker->dateTimeThisMonth(),
            'file_status_id' => $fileStatus->file_status_id,
            // 'file_rejection_reason' => $this->faker->sentence(),
        ];
    }
}
