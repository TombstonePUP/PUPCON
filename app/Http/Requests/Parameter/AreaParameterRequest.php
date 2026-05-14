<?php

namespace App\Http\Requests\Parameter;

use App\Http\Requests\BaseRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class AreaParameterRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->isAdminOrCoordinator();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'area_id' => ['required', 'integer'],
            'parameter_name' => ['nullable', 'string', 'max:1'],
            'parameter_description' => [
                'required',
                'string',
                'max:1000',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'parameter_name' => strtoupper(
                $this->parameter_name ?? ''
            ),
        ]);
    }
}
