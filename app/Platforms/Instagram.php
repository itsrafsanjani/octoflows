<?php

declare(strict_types=1);

namespace App\Platforms;

use Exception;
use App\Models\Post;
use App\Models\Channel;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use App\Interfaces\PlatformInterface;
use Illuminate\Support\Facades\Storage;

final readonly class Instagram implements PlatformInterface
{
    public function __construct(
        private Channel $channel,
    ) {}

    /**
     * @throws Exception
     */
    public function post(Post $post): JsonResponse
    {
        throw_if(count($post->media) < 1, new Exception('Instagram requires at least one media'));

        $container = Http::post("https://graph.facebook.com/{$this->channel->platform_id}/media", [
            'access_token' => $this->channel->access_token,
            'image_url' => Storage::url($post->media[0]['path']),
            'caption' => Str::limit($post->content, 2200),
        ]);

        if ($container->failed()) {
            $container->throw();
        }

        $containerId = $container->json()['id'];

        $response = Http::post("https://graph.facebook.com/{$this->channel->platform_id}/media_publish", [
            'access_token' => $this->channel->access_token,
            'creation_id' => $containerId,
        ]);

        if ($response->failed()) {
            $response->throw();
        }

        return response()->json($response->json(), $response->status());
    }
}
