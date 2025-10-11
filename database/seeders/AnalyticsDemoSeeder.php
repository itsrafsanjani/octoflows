<?php

declare(strict_types=1);

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Post;
use App\Models\User;
use App\Models\Channel;
use App\Models\PostAnalytics;
use Illuminate\Database\Seeder;

final class AnalyticsDemoSeeder extends Seeder
{
    /**
     * Run the database seeds for demo purposes.
     */
    public function run(): void
    {
        $user = User::first();
        if (! $user) {
            $this->command->info('No user found. Please run the main seeder first.');

            return;
        }

        $team = $user->currentTeam;
        if (! $team) {
            $this->command->info('No team found. Please run the main seeder first.');

            return;
        }

        // Create viral post examples
        $viralPosts = [
            [
                'content' => '🚀 AI Revolution: How Machine Learning is Transforming Industries - The Future is Now!',
                'platforms' => ['twitter', 'linkedin', 'youtube'],
                'metrics' => [
                    'impressions' => 450000,
                    'engagement' => 25000,
                    'clicks' => 8500,
                    'engagement_rate' => 8.5,
                ],
            ],
            [
                'content' => '💻 Building Scalable Applications: Best Practices Every Developer Should Know',
                'platforms' => ['youtube', 'discord', 'reddit'],
                'metrics' => [
                    'impressions' => 320000,
                    'engagement' => 18000,
                    'clicks' => 6200,
                    'engagement_rate' => 7.2,
                ],
            ],
            [
                'content' => '🎨 Mobile-First Design: Creating Better User Experiences in 2025',
                'platforms' => ['instagram', 'pinterest', 'tiktok'],
                'metrics' => [
                    'impressions' => 280000,
                    'engagement' => 22000,
                    'clicks' => 7800,
                    'engagement_rate' => 9.1,
                ],
            ],
        ];

        foreach ($viralPosts as $postData) {
            $post = Post::create([
                'team_id' => $team->id,
                'user_id' => $user->id,
                'post_type' => 'text',
                'ai_tone' => 'professional',
                'content' => $postData['content'],
                'published_at' => Carbon::now()->subDays(rand(1, 7)),
                'is_draft' => false,
                'is_picked_by_job' => true,
            ]);

            // Assign to platforms
            foreach ($postData['platforms'] as $platform) {
                $channel = Channel::where('team_id', $team->id)
                    ->where('platform', $platform)
                    ->first();

                if ($channel) {
                    $post->channels()->attach($channel);

                    // Create impressive analytics
                    PostAnalytics::create([
                        'post_id' => $post->id,
                        'channel_id' => $channel->id,
                        'platform' => $platform,
                        'platform_post_id' => 'viral_'.$post->id.'_'.$platform,
                        'impressions' => $postData['metrics']['impressions'],
                        'reach' => (int) ($postData['metrics']['impressions'] * 0.88),
                        'engagement' => $postData['metrics']['engagement'],
                        'likes' => (int) ($postData['metrics']['engagement'] * 0.65),
                        'shares' => (int) ($postData['metrics']['engagement'] * 0.20),
                        'comments' => (int) ($postData['metrics']['engagement'] * 0.15),
                        'clicks' => $postData['metrics']['clicks'],
                        'saves' => (int) ($postData['metrics']['engagement'] * 0.12),
                        'engagement_rate' => $postData['metrics']['engagement_rate'],
                        'click_through_rate' => rand(25, 45) / 10, // 2.5% to 4.5%
                        'analytics_date' => $post->published_at->format('Y-m-d'),
                    ]);
                }
            }
        }

        $this->command->info('🎯 Viral demo posts created successfully!');
        $this->command->info('📈 These posts will show impressive metrics in your analytics dashboard');
    }
}
