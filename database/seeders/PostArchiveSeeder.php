<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Team;
use App\Models\User;
use App\Models\Channel;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

final class PostArchiveSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a team and user
        $team = Team::first();
        $user = User::first();

        if (! $team || ! $user) {
            $this->command->error('Please run the main database seeder first to create teams and users.');

            return;
        }

        // Create channels if they don't exist
        $channels = Channel::first();
        if (! $channels) {
            $channels = collect([
                Channel::factory()->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'platform' => 'facebook',
                    'name' => 'My Facebook Page',
                    'type' => 'page',
                ]),
                Channel::factory()->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'platform' => 'twitter',
                    'name' => '@MyTwitterHandle',
                    'type' => 'account',
                ]),
                Channel::factory()->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'platform' => 'instagram',
                    'name' => 'My Instagram Account',
                    'type' => 'account',
                ]),
                Channel::factory()->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'platform' => 'linkedin',
                    'name' => 'My LinkedIn Profile',
                    'type' => 'profile',
                ]),
            ]);
        } else {
            $channels = collect([$channels]);
        }

        $this->command->info('Creating archive posts...');

        // Create a mix of published and scheduled posts
        $posts = collect();

        // Create 30 published single posts
        $posts = $posts->merge(
            Post::factory()
                ->count(30)
                ->single()
                ->published()
                ->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                ])
        );

        // Create 20 published campaign posts
        $posts = $posts->merge(
            Post::factory()
                ->count(20)
                ->campaign()
                ->published()
                ->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                ])
        );

        // Create 10 scheduled single posts
        $posts = $posts->merge(
            Post::factory()
                ->count(10)
                ->single()
                ->scheduled()
                ->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                ])
        );

        // Create 5 scheduled campaign posts
        $posts = $posts->merge(
            Post::factory()
                ->count(5)
                ->campaign()
                ->scheduled()
                ->create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                ])
        );

        // Attach random channels to posts
        foreach ($posts as $post) {
            $randomChannels = $channels->random(fake()->numberBetween(1, min(3, $channels->count())));
            $post->channels()->attach($randomChannels->pluck('id'));
        }

        $this->command->info("Created {$posts->count()} archive posts:");
        $this->command->info('- 30 published single posts');
        $this->command->info('- 20 published campaign posts');
        $this->command->info('- 10 scheduled single posts');
        $this->command->info('- 5 scheduled campaign posts');
        $this->command->info('Post archive seeded successfully!');
    }
}
