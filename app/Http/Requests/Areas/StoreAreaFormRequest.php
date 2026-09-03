<?php

namespace App\Http\Requests\Areas;

use App\Http\Requests\BaseRequest;
use App\Http\Requests\Files\UploadPdfRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class StoreAreaFormRequest extends BaseRequest
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
            'form_id' => [
                'required',
                'integer',
                'exists:area_forms,area_form_id',
            ],
            'document' => UploadPdfRequest::pdfRules(),
        ];
    }
}
