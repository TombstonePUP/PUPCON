<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BaseRequest extends FormRequest
{
    protected function hasRole(string ...$roles): bool
    {
        $user = $this->user();

        return in_array(
            $user?->Roles?->role_name,
            $roles,
            true
        );
    }

    protected function isAdminOrCoordinator(): bool
    {
        return $this->hasRole('Admin', 'Coordinator');
    }

    protected function isAdminCoordinatorOrChairman(): bool
    {
        return $this->hasRole('Admin', 'Coordinator', 'Chairman');
    }

    /**
     * @return array<string,array<int,string>>
     */
    public function programAreaRules(): array
    {
        return [
            'program_id' => [
                'required',
                'integer',
                'exists:programs,program_id',
            ],
            'level_id' => [
                'required',
                'integer',
                'exists:accreditation_levels,accreditation_level_id',
            ],
            'area_id' => [
                'required',
                'integer',
                'exists:areas,area_id',
            ],
        ];
    }
}
