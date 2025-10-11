<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\TrendingHashtag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrendingHashtag>
 */
final class TrendingHashtagFactory extends Factory
{
    protected $model = TrendingHashtag::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $platforms = ['twitter', 'instagram', 'facebook', 'tiktok', 'linkedin'];
        $hashtag = $this->faker->words(2, false);
        $hashtag = implode('', array_map('ucfirst', $hashtag));
        
        return [
            'hashtag' => $hashtag,
            'platform' => $this->faker->randomElement($platforms),
            'usage_count' => $this->faker->numberBetween(1000, 100000),
            'engagement_score' => $this->faker->numberBetween(60, 100),
            'growth_rate' => $this->faker->numberBetween(20, 400),
            'related_topics' => $this->faker->randomElements(['Technology', 'Innovation', 'AI', 'Climate', 'Health', 'Business'], 3),
            'metadata' => [
                'trending_duration' => $this->faker->numberBetween(1, 7),
                'peak_time' => $this->faker->time('H:i'),
            ],
            'trending_since' => $this->faker->dateTimeBetween('-48 hours', 'now'),
            'last_updated' => $this->faker->dateTimeBetween('-12 hours', 'now'),
            'is_active' => true,
        ];
    }
}
