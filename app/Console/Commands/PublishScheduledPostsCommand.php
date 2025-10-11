<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Post;
use App\Jobs\PublishPostJob;
use Illuminate\Console\Command;

final class PublishScheduledPostsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:publish-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish Scheduled Posts';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Post::with(['channels'])
            ->where([
                'is_picked_by_job' => false, // this is to make sure that the post is not already picked by a job
            ])
            ->where('published_at', '<=', now())
            ->chunk(100, function ($posts): void {
                foreach ($posts as $post) {
                    $post->update(['is_picked_by_job' => true]);
                    foreach ($post->channels as $channel) {
                        PublishPostJob::dispatch($post, $channel)->delay($post->published_at);
                    }
                }
            });
    }
}
