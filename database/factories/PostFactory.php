<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
final class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::query()->first(),
            'user_id' => User::query()->first(),
            'content' => fake()->realTextBetween(10, 50),
            'media' => [
                [
                    'id' => Str::uuid(),
                    'name' => fake()->colorName().'.jpg',
                    'path' => 'media/'.fake()->sha1.'jpg',
                    'size' => fake()->numberBetween(1_000, 100_000),
                    'filetype' => 'jpg',
                ],
            ],
            'published_at' => fake()->dateTimeBetween('now', '+1 week'),
            'is_picked_by_job' => fake()->boolean(),
        ];
    }
}
