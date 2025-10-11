<?php

declare(strict_types=1);

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Post;
use App\Models\Channel;
use App\Models\PostAnalytics;
use Illuminate\Database\Seeder;

final class PostAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing posts and channels
        $posts = Post::where('is_draft', false)->get();
        $channels = Channel::all();

        if ($posts->isEmpty() || $channels->isEmpty()) {
            $this->command->info('No posts or channels found. Please create some posts and channels first.');

            return;
        }

        // Generate analytics data for the last 30 days
        $startDate = Carbon::now()->subDays(30);

        foreach ($posts as $post) {
            $postChannels = $post->channels()->get();

            foreach ($postChannels as $channel) {
                // Generate analytics for each day since the post was published
                $analyticsDate = $post->published_at ? $post->published_at->copy() : $startDate->copy();

                while ($analyticsDate->lte(Carbon::now())) {
                    // Skip if this combination already exists
                    if (! PostAnalytics::where('post_id', $post->id)
                        ->where('channel_id', $channel->id)
                        ->where('analytics_date', $analyticsDate->format('Y-m-d'))
                        ->exists()) {

                        // Generate realistic analytics data
                        $impressions = rand(1000, 50000);
                        $engagement = rand(50, 2000);
                        $likes = (int) ($engagement * 0.7);
                        $shares = (int) ($engagement * 0.15);
                        $comments = (int) ($engagement * 0.15);
                        $clicks = rand(20, 500);
                        $saves = rand(5, 100);

                        $engagementRate = $impressions > 0 ? ($engagement / $impressions) * 100 : 0;
                        $clickThroughRate = $impressions > 0 ? ($clicks / $impressions) * 100 : 0;

                        PostAnalytics::create([
                            'post_id' => $post->id,
                            'channel_id' => $channel->id,
                            'platform' => $channel->platform,
                            'platform_post_id' => 'mock_'.$post->id.'_'.$channel->id,
                            'impressions' => $impressions,
                            'reach' => (int) ($impressions * 0.8),
                            'engagement' => $engagement,
                            'likes' => $likes,
                            'shares' => $shares,
                            'comments' => $comments,
                            'clicks' => $clicks,
                            'saves' => $saves,
                            'engagement_rate' => round($engagementRate, 2),
                            'click_through_rate' => round($clickThroughRate, 2),
                            'analytics_date' => $analyticsDate->format('Y-m-d'),
                        ]);
                    }

                    $analyticsDate->addDay();
                }
            }
        }

        $this->command->info('Post analytics data seeded successfully!');
    }
}
