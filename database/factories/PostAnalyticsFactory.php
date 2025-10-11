<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\Channel;
use App\Models\PostAnalytics;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PostAnalytics>
 */
final class PostAnalyticsFactory extends Factory
{
    protected $model = PostAnalytics::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $impressions = $this->faker->numberBetween(1000, 50000);
        $engagement = $this->faker->numberBetween(50, 2000);
        $likes = (int) ($engagement * 0.7);
        $shares = (int) ($engagement * 0.15);
        $comments = (int) ($engagement * 0.15);
        $clicks = $this->faker->numberBetween(20, 500);
        $saves = $this->faker->numberBetween(5, 100);

        $engagementRate = $impressions > 0 ? ($engagement / $impressions) * 100 : 0;
        $clickThroughRate = $impressions > 0 ? ($clicks / $impressions) * 100 : 0;

        return [
            'post_id' => Post::factory(),
            'channel_id' => Channel::factory(),
            'platform' => $this->faker->randomElement(['twitter', 'facebook', 'instagram', 'linkedin', 'reddit', 'youtube', 'tiktok', 'pinterest', 'snapchat', 'discord', 'twitch']),
            'platform_post_id' => $this->faker->uuid(),
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
            'analytics_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
