<?php

namespace App\Http\Requests\Files;

use App\Http\Requests\BaseRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class BatchFileActionRequest extends BaseRequest
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
            'file_ids' => [
                'required',
                'array',
            ],
            'file.*.file_id' => [
                'integer',
                'exists:files,file_id',
            ],
            'file.*.type' => [
                'required',
                'string',
            ],
        ];
    }
}
