<?php

declare(strict_types=1);

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Post;
use App\Models\User;
use App\Models\Channel;
use App\Models\PostAnalytics;
use Illuminate\Database\Seeder;

final class PresentationDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing analytics data
        PostAnalytics::truncate();

        // Get the first user and team
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

        // Create impressive channels for all platforms
        $platforms = [
            'twitter' => ['name' => 'TechNews Daily', 'type' => 'Profile'],
            'facebook' => ['name' => 'Innovation Hub', 'type' => 'Page'],
            'instagram' => ['name' => 'Creative Studio', 'type' => 'Business'],
            'linkedin' => ['name' => 'Professional Network', 'type' => 'Company'],
            'reddit' => ['name' => 'TechCommunity', 'type' => 'Subreddit'],
            'youtube' => ['name' => 'Tech Tutorials', 'type' => 'Channel'],
            'tiktok' => ['name' => 'Quick Tech Tips', 'type' => 'Creator'],
            'pinterest' => ['name' => 'Design Inspiration', 'type' => 'Board'],
            'snapchat' => ['name' => 'Behind the Scenes', 'type' => 'Story'],
            'discord' => ['name' => 'Developer Community', 'type' => 'Server'],
            'twitch' => ['name' => 'Live Coding Sessions', 'type' => 'Streamer'],
        ];

        $channels = [];
        foreach ($platforms as $platform => $config) {
            $channels[$platform] = Channel::firstOrCreate([
                'team_id' => $team->id,
                'platform' => $platform,
                'name' => $config['name'],
                'type' => $config['type'],
            ], [
                'user_id' => $user->id,
                'platform_id' => 'demo_'.$platform.'_id',
                'access_token' => 'demo_token_'.$platform,
            ]);
        }

        // Create impressive posts with realistic content
        $postTemplates = [
            'AI Revolution: How Machine Learning is Transforming Industries 🚀',
            'The Future of Web Development: Trends to Watch in 2025 💻',
            'Building Scalable Applications: Best Practices for Developers 🏗️',
            'Cybersecurity Essentials: Protecting Your Digital Assets 🔒',
            'Cloud Computing: Migrating to the Modern Infrastructure ☁️',
            'Mobile-First Design: Creating Better User Experiences 📱',
            'DevOps Culture: Streamlining Development and Operations 🔄',
            'Blockchain Technology: Beyond Cryptocurrency ⛓️',
            'Data Science Insights: Making Data-Driven Decisions 📊',
            'Open Source Contributions: Building the Future Together 🤝',
            'Remote Work Tools: Productivity in the Digital Age 🏠',
            'Sustainable Technology: Green Computing Practices 🌱',
            'API Design: Building Developer-Friendly Interfaces 🔌',
            'Microservices Architecture: Scaling Your Applications 🏢',
            'User Experience Design: Creating Intuitive Interfaces 🎨',
            'Database Optimization: Performance Tuning Strategies 🗄️',
            'Frontend Frameworks: Choosing the Right Tool 🛠️',
            'Backend Development: Server-Side Best Practices ⚙️',
            'Testing Strategies: Ensuring Code Quality 🧪',
            'Continuous Integration: Automating Your Workflow 🔄',
        ];

        $posts = [];
        foreach ($postTemplates as $index => $content) {
            $publishedDate = Carbon::now()->subDays(rand(1, 30));

            $post = Post::create([
                'team_id' => $team->id,
                'user_id' => $user->id,
                'post_type' => 'text',
                'ai_tone' => 'professional',
                'content' => $content,
                'published_at' => $publishedDate,
                'is_draft' => false,
                'is_picked_by_job' => true,
            ]);

            // Assign posts to random platforms (some posts on multiple platforms)
            $platformKeys = array_keys($platforms);
            $numPlatforms = rand(1, min(3, count($platformKeys)));
            $selectedPlatforms = array_rand($platformKeys, $numPlatforms);

            if (! is_array($selectedPlatforms)) {
                $selectedPlatforms = [$selectedPlatforms];
            }

            foreach ($selectedPlatforms as $platformIndex) {
                $platform = $platformKeys[$platformIndex];
                $post->channels()->attach($channels[$platform]);
            }

            $posts[] = $post;
        }

        // Generate impressive analytics data
        foreach ($posts as $post) {
            $postChannels = $post->channels()->get();

            foreach ($postChannels as $channel) {
                // Generate analytics for each day since the post was published
                $analyticsDate = $post->published_at ? $post->published_at->copy() : Carbon::now()->subDays(30);

                // Generate multiple days of data for each post
                for ($day = 0; $day < min(7, Carbon::now()->diffInDays($analyticsDate)); $day++) {
                    $currentDate = $analyticsDate->copy()->addDays($day);

                    // Platform-specific impressive metrics
                    $metrics = $this->getPlatformMetrics($channel->platform, $day);

                    PostAnalytics::create([
                        'post_id' => $post->id,
                        'channel_id' => $channel->id,
                        'platform' => $channel->platform,
                        'platform_post_id' => 'demo_'.$post->id.'_'.$channel->id.'_'.$day,
                        'impressions' => $metrics['impressions'],
                        'reach' => (int) ($metrics['impressions'] * 0.85),
                        'engagement' => $metrics['engagement'],
                        'likes' => (int) ($metrics['engagement'] * 0.6),
                        'shares' => (int) ($metrics['engagement'] * 0.15),
                        'comments' => (int) ($metrics['engagement'] * 0.25),
                        'clicks' => $metrics['clicks'],
                        'saves' => (int) ($metrics['engagement'] * 0.1),
                        'engagement_rate' => $metrics['engagement_rate'],
                        'click_through_rate' => $metrics['click_through_rate'],
                        'analytics_date' => $currentDate->format('Y-m-d'),
                    ]);
                }
            }
        }

        $this->command->info('🎉 Impressive presentation data seeded successfully!');
        $this->command->info('📊 Generated analytics for '.count($posts).' posts across '.count($channels).' platforms');
    }

    private function getPlatformMetrics(string $platform, int $dayOffset): array
    {
        // Impressive metrics that decrease over time (realistic viral decay)
        $decayFactor = max(0.3, 1 - ($dayOffset * 0.15));

        $baseMetrics = match ($platform) {
            'twitter' => [
                'impressions' => rand(15000, 85000),
                'engagement' => rand(800, 4500),
                'clicks' => rand(200, 1200),
                'engagement_rate' => rand(45, 85) / 10, // 4.5% to 8.5%
                'click_through_rate' => rand(12, 28) / 10, // 1.2% to 2.8%
            ],
            'facebook' => [
                'impressions' => rand(25000, 120000),
                'engagement' => rand(1200, 6800),
                'clicks' => rand(400, 2000),
                'engagement_rate' => rand(35, 75) / 10, // 3.5% to 7.5%
                'click_through_rate' => rand(15, 35) / 10, // 1.5% to 3.5%
            ],
            'instagram' => [
                'impressions' => rand(30000, 150000),
                'engagement' => rand(1500, 8500),
                'clicks' => rand(500, 2500),
                'engagement_rate' => rand(50, 90) / 10, // 5.0% to 9.0%
                'click_through_rate' => rand(18, 42) / 10, // 1.8% to 4.2%
            ],
            'linkedin' => [
                'impressions' => rand(12000, 65000),
                'engagement' => rand(600, 3500),
                'clicks' => rand(150, 900),
                'engagement_rate' => rand(40, 80) / 10, // 4.0% to 8.0%
                'click_through_rate' => rand(10, 25) / 10, // 1.0% to 2.5%
            ],
            'youtube' => [
                'impressions' => rand(45000, 200000),
                'engagement' => rand(2000, 12000),
                'clicks' => rand(800, 4000),
                'engagement_rate' => rand(30, 65) / 10, // 3.0% to 6.5%
                'click_through_rate' => rand(20, 50) / 10, // 2.0% to 5.0%
            ],
            'tiktok' => [
                'impressions' => rand(80000, 400000),
                'engagement' => rand(4000, 20000),
                'clicks' => rand(1000, 5000),
                'engagement_rate' => rand(60, 120) / 10, // 6.0% to 12.0%
                'click_through_rate' => rand(25, 60) / 10, // 2.5% to 6.0%
            ],
            'reddit' => [
                'impressions' => rand(8000, 45000),
                'engagement' => rand(400, 2500),
                'clicks' => rand(100, 600),
                'engagement_rate' => rand(45, 85) / 10, // 4.5% to 8.5%
                'click_through_rate' => rand(12, 30) / 10, // 1.2% to 3.0%
            ],
            'pinterest' => [
                'impressions' => rand(20000, 100000),
                'engagement' => rand(1000, 6000),
                'clicks' => rand(300, 1800),
                'engagement_rate' => rand(35, 70) / 10, // 3.5% to 7.0%
                'click_through_rate' => rand(15, 40) / 10, // 1.5% to 4.0%
            ],
            'snapchat' => [
                'impressions' => rand(15000, 80000),
                'engagement' => rand(800, 4500),
                'clicks' => rand(200, 1200),
                'engagement_rate' => rand(40, 80) / 10, // 4.0% to 8.0%
                'click_through_rate' => rand(18, 45) / 10, // 1.8% to 4.5%
            ],
            'discord' => [
                'impressions' => rand(5000, 25000),
                'engagement' => rand(250, 1500),
                'clicks' => rand(80, 400),
                'engagement_rate' => rand(50, 100) / 10, // 5.0% to 10.0%
                'click_through_rate' => rand(20, 50) / 10, // 2.0% to 5.0%
            ],
            'twitch' => [
                'impressions' => rand(10000, 60000),
                'engagement' => rand(500, 3000),
                'clicks' => rand(150, 900),
                'engagement_rate' => rand(35, 75) / 10, // 3.5% to 7.5%
                'click_through_rate' => rand(15, 40) / 10, // 1.5% to 4.0%
            ],
            default => [
                'impressions' => rand(10000, 50000),
                'engagement' => rand(500, 3000),
                'clicks' => rand(150, 900),
                'engagement_rate' => rand(40, 80) / 10,
                'click_through_rate' => rand(15, 35) / 10,
            ],
        };

        return [
            'impressions' => (int) ($baseMetrics['impressions'] * $decayFactor),
            'engagement' => (int) ($baseMetrics['engagement'] * $decayFactor),
            'clicks' => (int) ($baseMetrics['clicks'] * $decayFactor),
            'engagement_rate' => $baseMetrics['engagement_rate'],
            'click_through_rate' => $baseMetrics['click_through_rate'],
        ];
    }
}
