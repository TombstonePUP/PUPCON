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
            'assigned_areas' => ['array'],
            'assigned_areas.*' => ['integer', 'exists:areas,area_id', 'required_if:assigned_roles,3,4'],
            'assigned_programs' => ['array'],
            'assigned_programs.*' => ['integer', 'exists:programs,program_id', 'required_if:assigned_roles,3,4'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required',
            'assigned_role.required' => 'Assigned role is required',
            'assigned_role.exists' => 'The selected assigned role does not exist',

            'assigned_areas.exists' => 'One or more of the selected assigned areas do not exist',
            'assigned_areas.*.required_if' => 'Assigned areas are required for the selected role',

            'assigned_programs.exists' => 'One or more of the selected assigned programs do not exist',
            'assigned_programs.*.required_if' => 'Assigned programs are required for the selected role',

        ];
    }
}
