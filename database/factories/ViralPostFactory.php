<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ViralPost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ViralPost>
 */
final class ViralPostFactory extends Factory
{
    protected $model = ViralPost::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $platforms = ['twitter', 'instagram', 'facebook', 'tiktok', 'linkedin'];
        $hashtags = ['#AI', '#Innovation', '#Technology', '#ClimateAction', '#HealthTech', '#FutureOfWork'];
        
        return [
            'external_id' => 'post_' . $this->faker->uuid(),
            'platform' => $this->faker->randomElement($platforms),
            'content' => $this->faker->paragraph(3) . ' ' . $this->faker->randomElement($hashtags),
            'author_username' => $this->faker->userName(),
            'author_name' => $this->faker->name(),
            'likes_count' => $this->faker->numberBetween(1000, 100000),
            'shares_count' => $this->faker->numberBetween(100, 10000),
            'comments_count' => $this->faker->numberBetween(50, 5000),
            'engagement_score' => $this->faker->numberBetween(70, 100),
            'virality_score' => $this->faker->numberBetween(75, 98),
            'hashtags' => $this->faker->randomElements($hashtags, 3),
            'media_urls' => $this->faker->boolean(30) ? [$this->faker->imageUrl()] : [],
            'metadata' => [
                'verified_author' => $this->faker->boolean(20),
                'location' => $this->faker->optional()->country(),
            ],
            'published_at' => $this->faker->dateTimeBetween('-72 hours', 'now'),
            'discovered_at' => $this->faker->dateTimeBetween('-12 hours', 'now'),
            'is_active' => true,
        ];
    }
}
