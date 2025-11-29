<?php

namespace App\Http\Requests\Benchmarks;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'area_parameter_id' => [
                Rule::requiredIf(fn () => $this->method() === 'POST'),
                'integer',
            ],
            'benchmark_category' => [
                Rule::requiredIf(fn () => $this->method() === 'POST'),
                'integer',
            ],
            'benchmark_number' => [
                Rule::requiredIf(fn () => $this->method() === 'POST'),
                'string',
            ],
            'benchmark_description' => [
                Rule::requiredIf(fn () => $this->method() === 'POST'),
                'string',
            ],
            'is_container' => [
                Rule::requiredIf(fn () => $this->method() === 'POST'),
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
            'benchmark_description.required' => 'The outline description field is required.',
            'is_container.required' => 'The container field is required.',
        ];
    }
}
