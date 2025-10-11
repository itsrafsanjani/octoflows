<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use App\Models\Channel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Channel>
 */
final class ChannelFactory extends Factory
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
            'platform_id' => fake()->numberBetween(1_000_000_000, 9_999_999_999),
            'platform' => fake()->randomElement(['facebook', 'twitter', 'instagram']),
            'type' => fake()->randomElement(['page', 'group', 'account']),
            'name' => fake()->company,
            'access_token' => fake()->sha256,
            'access_token_secret' => fake()->sha256,
        ];
    }
}
