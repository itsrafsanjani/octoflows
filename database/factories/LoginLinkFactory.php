<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use App\Models\LoginLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoginLink>
 */
final class LoginLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<model-property<LoginLink>, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->create()->id,
            'token' => fake()->uuid(),
            'expires_at' => fake()->dateTimeBetween('5 minutes', '15 minutes'),
            'used_at' => null,
        ];
    }
}
