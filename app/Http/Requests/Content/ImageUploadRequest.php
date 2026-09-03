<?php

namespace App\Http\Requests\Content;

use App\Http\Requests\BaseRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ImageUploadRequest extends BaseRequest
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
    public function imageRules(bool $required = false, int $max = 5120): array
    {
        return [
            $required ? 'requiered' : 'nullable',
            'file',
            'mimes:jpeg,png,jpg,gif,svg',
            "max:$max", // Max file size in KB (5 MB)
        ];
    }
}
