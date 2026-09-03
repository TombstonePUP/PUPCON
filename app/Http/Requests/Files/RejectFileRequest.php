<?php

namespace App\Http\Requests\Files;

use Illuminate\Contracts\Validation\ValidationRule;

class RejectFileRequest extends BatchFileActionRequest
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
        return array_merge(parent::rules(), [
            'file.*.rejection_reason' => [
                'required',
                'string',
            ],
        ]);
    }
}
