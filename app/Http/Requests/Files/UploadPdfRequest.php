<?php

namespace App\Http\Requests\Files;

use App\Http\Requests\BaseRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class UploadPdfRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->isAdminCoordinatorOrChairman();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public static function pdfRules(
        bool $required = true,
        int $max = 10240
    ): array {
        return [
            $required ? 'required' : 'nullable',
            'file',
            'mimes:pdf',
            "max:$max",
        ];
    }
}
