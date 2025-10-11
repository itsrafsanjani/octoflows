<?php

declare(strict_types=1);

namespace App\Jobs;

use Exception;
use App\Models\Post;
use App\Models\Channel;
use App\Platforms\Twitter;
use App\Platforms\Facebook;
use App\Platforms\Instagram;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

final class PublishPostJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private Post $post,
        private Channel $channel
    ) {}

    /**
     * Execute the job.
     *
     * @throws Exception
     */
    public function handle(): void
    {
        $platform = match ($this->channel->platform) {
            'facebook' => new Facebook($this->channel),
            'twitter' => new Twitter($this->channel),
            'instagram' => new Instagram($this->channel),
            default => throw new Exception('Platform not supported'),
        };

        $platform->post($this->post);

        echo 'publishing post '.$this->post->id.' to channel '.$this->channel->title.PHP_EOL;
    }
}
