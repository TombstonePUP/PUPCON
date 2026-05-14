<?php

namespace App\Http\Requests\Benchmarks;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BenchmarkRequest extends FormRequest
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
        return [
            'area_parameter_id' => [
                Rule::requiredIf(fn () => $this->method() === 'POST'),
                'integer',
            ],
            'benchmark_category' => [
                'required',
                'integer',
            ],
            'benchmark_number' => [
                'required',
                'string',
                'regex:/^\d+(?:\.\d+)*$/',
            ],
            'benchmark_description' => [
                'required',
                'string',
            ],
            'is_container' => [
                'required',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'area_parameter_id.required' => 'The area parameter field is required.',
            'benchmark_category.required' => 'The parameter outline category field is required.',
            'benchmark_number.required' => 'The outline number field is required.',
            'benchmark_number.regex' => 'The outline number format is invalid. It should contain only numbers and periods (e.g., 1.2.3).',
            'benchmark_description.required' => 'The outline description field is required.',
            'is_container.required' => 'The container field is required.',
        ];
    }
}
