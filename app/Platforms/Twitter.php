<?php

declare(strict_types=1);

namespace App\Platforms;

use Exception;
use App\Models\Post;
use App\Models\Channel;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use App\Interfaces\PlatformInterface;
use Abraham\TwitterOAuth\TwitterOAuth;
use Illuminate\Support\Facades\Storage;
use Abraham\TwitterOAuth\TwitterOAuthException;

final class Twitter implements PlatformInterface
{
    public string $client_id;

    public string $client_secret;

    public TwitterOAuth $connection;

    public function __construct(public Channel $channel)
    {
        $this->client_id = config('services.twitter.client_id');
        $this->client_secret = config('services.twitter.client_secret');

        $this->connection = new TwitterOAuth(
            config('services.twitter.client_id'),
            config('services.twitter.client_secret'),
            $this->channel->access_token,
            $this->channel->access_token_secret,
        );
    }

    /**
     * Posts text to twitter.
     *
     * @throws Exception
     */
    public function post(Post $post): JsonResponse
    {
        // limit message to 280 character as twitter max character limit is 280
        $status = Str::limit($post->content, 280);

        $media_ids = [];
        if (count($post->media) > 0) {
            foreach ($post->media as $index => $media) {
                if ($index === 4) {
                    break;
                }

                 // Twitter only allows 4 images per tweet
                $media_ids[] = $this->uploadSinglePhoto($media);
            }
        }

        $tweet = [
            'status' => $status,
        ];

        if ($media_ids !== []) {
            $tweet['media_ids'] = implode(',', $media_ids);
        }

        $post = $this->connection->post('statuses/update', $tweet);

        throw_if(isset($post->errors), new TwitterOAuthException($post->errors[0]->message, $post->errors[0]->code));

        return response()->json($post);
    }

    /**
     * @throws TwitterOAuthException
     */
    private function uploadSinglePhoto(array $media): string
    {
        $media = $this->connection->upload('media/upload', [
            'media' => Storage::path($media['path']),

        ]);

        throw_if(isset($media->errors), new TwitterOAuthException($media->errors[0]->message, $media->errors[0]->code));

        return $media->media_id_string;
    }
}
