<?php

namespace App\Http\Requests\Users;

use App\Models\Roles;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $chairman = Roles::where('role_name', 'Chairman')->first();

        return [
            'user_id' => [
                'integer',
                'exists:users,user_id',
                Rule::requiredIf(fn () => $this->method() === 'PATCH'),
            ],
            'first_name' => [
                'string',
                'max:255',
                Rule::requiredIf(fn () => $this->user_id === null && $this->method() === 'POST'),
            ],
            'last_name' => [
                'string',
                'max:255',
                Rule::requiredIf(fn () => $this->user_id === null && $this->method() === 'POST'),
            ],
            'email' => [
                'lowercase',
                'unique:users,email',
                'string',
                'email',
                'max:255',
                Rule::requiredIf(fn () => $this->user_id === null && $this->method() === 'POST'),
            ],
            'assigned_role' => ['required', 'integer', 'exists:roles,role_id'],
            'assigned_areas' => [
                Rule::requiredIf(fn () => in_array($this->assigned_role, [$chairman->role_id])),
                'array',
            ],
            'assigned_areas.*' => ['integer', 'exists:areas,area_id'],

            'assigned_programs' => [
                Rule::requiredIf(fn () => in_array($this->assigned_role, [$chairman->role_id])),
                'array',
            ],
            'assigned_programs.*' => ['integer', 'exists:programs,program_id'],
        ];
    }

    public function messages(): array
    {
        return [
            // User ID
            'user_id.required' => 'User ID is required',

            // General fields
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'The email has already been taken',

            // Role
            'assigned_role.required' => 'Assigned role is required',
            'assigned_role.exists' => 'The selected role does not exist',

            // Areas
            'assigned_areas.required' => 'At least one area must be assigned',
            'assigned_areas.array' => 'Areas must be provided as an array',
            'assigned_areas.*.integer' => 'Each area must be a valid integer',

            // Programs
            'assigned_programs.required' => 'At least one program must be assigned',
            'assigned_programs.array' => 'Programs must be provided as an array',
            'assigned_programs.*.integer' => 'Each area must be a valid integer',
        ];
    }
}
