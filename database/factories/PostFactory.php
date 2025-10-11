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
        $postTypes = ['single', 'campaign'];
        $postType = fake()->randomElement($postTypes);
        $aiTones = ['professional', 'casual', 'friendly', 'authoritative', 'conversational'];

        // Generate realistic content based on post type
        $content = $this->generateRealisticContent($postType);

        // Randomly include media (30% chance)
        $media = fake()->boolean(30) ? $this->generateMedia() : null;

        // Generate platform configs
        $platformConfigs = $this->generatePlatformConfigs();

        // Published dates: 70% published (past), 30% scheduled (future)
        $isPublished = fake()->boolean(70);
        $publishedAt = $isPublished
            ? fake()->dateTimeBetween('-6 months', 'now')
            : fake()->dateTimeBetween('now', '+2 weeks');

        return [
            'team_id' => Team::query()->first(),
            'user_id' => User::query()->first(),
            'post_type' => $postType,
            'ai_tone' => fake()->randomElement($aiTones),
            'content' => $content,
            'media' => $media,
            'platform_configs' => $platformConfigs,
            'published_at' => $publishedAt,
            'is_draft' => false, // Archive only contains published/scheduled posts
            'is_picked_by_job' => fake()->boolean(20),
        ];
    }

    /**
     * Create a published post state
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'is_draft' => false,
        ]);
    }

    /**
     * Create a scheduled post state
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => fake()->dateTimeBetween('now', '+2 weeks'),
            'is_draft' => false,
        ]);
    }

    /**
     * Create a single post state
     */
    public function single(): static
    {
        return $this->state(fn (array $attributes) => [
            'post_type' => 'single',
        ]);
    }

    /**
     * Create a campaign post state
     */
    public function campaign(): static
    {
        return $this->state(fn (array $attributes) => [
            'post_type' => 'campaign',
        ]);
    }

    /**
     * Generate realistic content based on post type
     */
    private function generateRealisticContent(string $postType): string
    {
        $contents = [
            'single' => [
                'Morning Motivation: Start your day with positivity! What are your goals for today? #motivation #morning #goals',
                'Product Update Announcement: Exciting news! We\'ve just released our latest feature update. Check out what\'s new and improved! 🚀',
                'Afternoon Productivity Tip: Take a 5-minute break every hour to boost your focus and energy! #productivity #wellness',
                'Customer Success Story: "This tool transformed our workflow completely!" - Sarah M., Marketing Director. Read more: [link]',
                'Weekend Inspiration: Sometimes the best way to move forward is to take a step back and recharge. Happy weekend! ☀️',
                'Industry News: Breaking: New social media trends for 2024 are here! Stay ahead of the curve with these insights.',
                'Thank You Thursday: Grateful for our amazing community! Your feedback helps us improve every day. 🙏',
                'Tech Tip Tuesday: Did you know you can save time with keyboard shortcuts? Here are our top 5 favorites! ⌨️',
                'Flashback Friday: Remember when we started this journey? Thank you for being part of our story! 📸',
                'Monday Motivation: Every expert was once a beginner. Don\'t give up on your dreams! 💪',
            ],
            'campaign' => [
                'Morning Motivation - Day 1: Start your day with positivity! What are your goals for today? #motivation #morning #goals',
                'Product Launch Series - Introduction: We\'re thrilled to announce our biggest update yet! Stay tuned for the full reveal. 🎉',
                'Holiday Campaign - Week 1: The season of giving starts now! Share your favorite holiday memory in the comments. ❄️',
                'Spring Cleaning Challenge - Day 3: Digital decluttering edition! Clean up your email inbox today. 📧',
                'Summer Fitness Series - Week 2: Hydration is key! Remember to drink water throughout your day. 💧',
                'Back to School Campaign - Day 5: Learning never stops! What new skill are you excited to master? 📚',
                'New Year Resolution Series - Week 1: Small steps lead to big changes. What\'s your first goal? 🎯',
                'Earth Day Awareness - Day 2: Every action counts! Share how you\'re making a difference today. 🌱',
                'Customer Appreciation Week - Day 4: Thank you for trusting us with your business! Your success is our success. 🙏',
                'Black Friday Countdown - Day 7: The biggest sale of the year is coming! Are you ready? 🛍️',
            ],
        ];

        return fake()->randomElement($contents[$postType]);
    }

    /**
     * Generate realistic media array
     */
    private function generateMedia(): ?array
    {
        if (! fake()->boolean(30)) {
            return null;
        }

        $fileTypes = ['jpg', 'png', 'gif', 'mp4'];
        $fileType = fake()->randomElement($fileTypes);

        return [
            [
                'id' => Str::uuid(),
                'name' => fake()->words(2, true).'.'.$fileType,
                'path' => 'media/'.fake()->sha1().'.'.$fileType,
                'size' => fake()->numberBetween(50_000, 5_000_000),
                'filetype' => $fileType,
            ],
        ];
    }

    /**
     * Generate platform-specific configurations
     */
    private function generatePlatformConfigs(): array
    {
        $platforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
        $selectedPlatforms = fake()->randomElements($platforms, fake()->numberBetween(1, 3));

        $configs = [];
        foreach ($selectedPlatforms as $platform) {
            $configs[$platform] = [
                'hashtags' => fake()->words(fake()->numberBetween(1, 5)),
                'mentions' => fake()->words(fake()->numberBetween(0, 3)),
                'scheduled_time' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d H:i:s'),
            ];
        }

        return $configs;
    }
}
