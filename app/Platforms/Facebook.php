<?php

declare(strict_types=1);

namespace App\Platforms;

use Exception;
use App\Models\Post;
use App\Models\Channel;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use App\Interfaces\PlatformInterface;
use Illuminate\Support\Facades\Storage;

final class Facebook implements PlatformInterface
{
    public function __construct(
        protected Channel $channel,
    ) {}

    /**
     * @throws Exception
     */
    public function post(Post $post): JsonResponse
    {
        $params = [
            'message' => $post->content,
            'access_token' => $this->channel->access_token,
        ];

        if (count($post->media) > 0) {
            foreach ($post->media as $index => $media) {
                $id = $this->uploadSinglePhoto($this->channel->platform_id, $media);
                $params['attached_media'][$index] = [
                    'media_fbid' => $id,
                ];
            }
        }

        $response = Http::post("https://graph.facebook.com/{$this->channel->platform_id}/feed", $params);

        if ($response->failed()) {
            $response->throw();
        }

        return response()->json($response->json(), $response->status());
    }

    /**
     * @throws Exception
     */
    private function uploadSinglePhoto(string $platformId, array $media): string
    {
        $response = Http::attach('attachment', file_get_contents(Storage::path($media['path'])), $media['name'])
            ->post("https://graph.facebook.com/$platformId/photos", [
                'access_token' => $this->channel->access_token,
                'published' => false,
            ]);

        if ($response->failed()) {
            $response->throw();
        }

        return $response->json()['id'];
    }
}
