<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BaseRequest extends FormRequest
{
    /**
     * Make route parameters (e.g. {program_id}, {level_id}, {area_id} in the
     * URL path) available to validation. In newer Laravel versions, route
     * parameters are NOT merged into the request input, so a FormRequest that
     * validates against them (see programAreaRules) would otherwise fail with
     * "required" even though the values are present in the URL.
     *
     * @return array<string, mixed>
     */
    public function validationData(): array
    {
        return array_merge(
            $this->route()?->parameters() ?? [],
            $this->all()
        );
    }

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
