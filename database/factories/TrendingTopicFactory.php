<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\TrendingTopic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrendingTopic>
 */
final class TrendingTopicFactory extends Factory
{
    protected $model = TrendingTopic::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Technology', 'Entertainment', 'Sports', 'Politics', 'Business', 'Health', 'Environment', 'Education'];
        $platforms = ['twitter', 'instagram', 'facebook', 'tiktok', 'linkedin'];
        
        return [
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(15),
            'category' => $this->faker->randomElement($categories),
            'platform' => $this->faker->randomElement($platforms),
            'engagement_score' => $this->faker->numberBetween(50, 100),
            'mentions_count' => $this->faker->numberBetween(100, 50000),
            'growth_rate' => $this->faker->numberBetween(10, 500),
            'metadata' => [
                'sentiment' => $this->faker->randomElement(['positive', 'negative', 'neutral']),
                'languages' => $this->faker->randomElements(['en', 'es', 'fr', 'de', 'it'], 2),
            ],
            'trending_since' => $this->faker->dateTimeBetween('-48 hours', 'now'),
            'last_updated' => $this->faker->dateTimeBetween('-12 hours', 'now'),
            'is_active' => true,
        ];
    }
}
