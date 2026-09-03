<?php

namespace Database\Factories;

use App\Models\ExhibitFiles;
use App\Models\ExhibitOutlines;
use App\Models\FileStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExhibitFiles>
 */
class ExhibitFilesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $exhibitOutline = ExhibitOutlines::inRandomOrder()->first();
        $fileStatus = FileStatus::inRandomOrder()->first();
        $user = User::inRandomOrder()->first();

        return [
            // 'exhibit_file_id' => $this->faker->unique()->randomNumber(),
            'exhibit_outline_id' => $exhibitOutline->exhibit_outline_id,
            /* 'file_name' => $this->faker->word(),
            'file_path' => $this->faker->filePath(), */
            'uploaded_by' => $user->user_id,
            // 'uploaded_at' => $this->faker->dateTimeThisMonth(),
            'file_status_id' => $fileStatus->file_status_id,
            // 'file_rejection_reason' => $this->faker->sentence(),
        ];
    }
}
