<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'lowercase', 'string', 'email', 'max:255'],
            'assigned_role' => ['required', 'integer', 'exists:roles,role_id'],
            'assigned_areas' => ['array', 'exists:areas,area_id'],
            'assigned_programs' => ['array', 'exists:programs,program_id'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'assigned_role.required' => 'Assigned role is required',
            'assigned_role.exists' => 'The selected assigned role does not exist',
            'assigned_areas.exists' => 'One or more of the selected assigned areas do not exist',
            'assigned_programs.exists' => 'One or more of the selected assigned programs do not exist',
        ];
    }
}
