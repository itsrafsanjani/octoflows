<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

final class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'post_type' => ['required', 'string', 'in:text,visual,video'],
            'ai_tone' => ['nullable', 'string', 'in:professional,friendly,casual,formal,humorous'],
            'channels' => ['required', 'array', 'min:1'],
            'content' => ['required', 'string'],
            'media' => ['nullable', 'array', 'min:1'],
            'media.*' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,mp4,mov,avi', 'max:'.(1024 * 100)],
            'platform_configs' => ['nullable', 'array'],
            'platform_configs.*' => ['array'],
            'is_scheduled' => ['required', 'boolean'],
            'published_at' => ['required_if_accepted:is_scheduled'],
            'is_draft' => ['boolean'],
        ];
    }
}
