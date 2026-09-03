<?php

namespace App\Http\Requests\Content;

use App\Http\Requests\BaseRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ContentPageRequest extends BaseRequest
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
    public function pageRules(): array
    {
        return [
            'page' => [
                'required',
                'array',
            ],
            'page.content_page_id' => [
                'integer',
                'exists:content_pages,content_page_id',
            ],
            'page.page' => [
                'required',
                'string',
            ],
            'page.title' => [
                'required',
                'string',
            ],
        ];
    }
}
