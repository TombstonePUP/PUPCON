<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRolesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->Roles->whereIn('role_name', ['Admin', 'Coordinator'])->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,user_id'],
            'assigned_role' => ['required', 'integer', 'exists:roles,role_id'],
            'assigned_areas' => ['required', 'array', 'exists:areas,area_id'],
            'assigned_programs' => ['required', 'array', 'exists:programs,program_id'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required',
            'assigned_role.required' => 'Assigned role is required',
            'assigned_role.exists' => 'The selected assigned role does not exist',
            'assigned_areas.exists' => 'One or more of the selected assigned areas do not exist',
            'assigned_programs.exists' => 'One or more of the selected assigned programs do not exist',
        ];
    }
}
