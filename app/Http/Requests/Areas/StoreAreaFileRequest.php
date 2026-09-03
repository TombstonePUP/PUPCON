<?php

namespace App\Http\Requests\Areas;

use App\Http\Requests\BaseRequest;
use App\Http\Requests\Files\UploadPdfRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class StoreAreaFileRequest extends BaseRequest
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
    public function rules(): array
    {
        return [
            ...$this->programAreaRules(),
            'outline_id' => [
                'required',
                'integer',
                'exists:parameter_outlines,parameter_outline_id',
            ],
            'document' => UploadPdfRequest::pdfRules(),
        ];
    }

    public function messages(): array
    {
        return [
            'outline_id.required' => 'The parameter outline is required.',
            'outline_id.integer' => 'The parameter outline must be an integer.',
            'outline_id.exists' => 'The selected parameter outline does not exist.',
            'document.required' => 'Please upload a PDF document.',
            'document.file' => 'The uploaded file must be a valid file.',
            'document.mimes' => 'The uploaded file must be a PDF document.',
        ];
    }
}
