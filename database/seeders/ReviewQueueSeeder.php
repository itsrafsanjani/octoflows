<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Team;
use App\Models\Channel;
use Illuminate\Database\Seeder;

final class ReviewQueueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first team and users
        $team = Team::first();
        if (! $team) {
            $this->command->info('No team found. Please create a team first.');

            return;
        }

        $users = $team->allUsers();
        if ($users->isEmpty()) {
            $this->command->info('No users found in the team.');

            return;
        }

        // Get channels
        $channels = Channel::where('team_id', $team->id)->get();
        if ($channels->isEmpty()) {
            $this->command->info('No channels found. Please create channels first.');

            return;
        }

        // Sample posts for review queue
        $samplePosts = [
            [
                'content' => 'Check out this amazing deal! Click here now for exclusive offers that you won\'t find anywhere else. Limited time only! 🔥',
                'review_status' => 'pending',
                'review_flags' => ['Suspicious link detected'],
            ],
            [
                'content' => 'New product launch tomorrow! Get ready for something special 🎉 We\'ve been working hard on this and can\'t wait to share it with you all.',
                'review_status' => 'pending',
                'review_flags' => [],
            ],
            [
                'content' => 'Behind the scenes of our latest campaign... Stay tuned for the big reveal next week! 🎬',
                'review_status' => 'pending',
                'review_flags' => ['Image quality issue'],
            ],
            [
                'content' => 'Thank you to all our amazing customers for your support! We couldn\'t have done it without you 💙',
                'review_status' => 'approved',
                'reviewed_by' => $users->first()->id,
                'reviewed_at' => now()->subHours(2),
                'review_notes' => 'Great customer appreciation post!',
            ],
            [
                'content' => 'Join us for our weekly webinar on digital marketing strategies. Free registration!',
                'review_status' => 'approved',
                'reviewed_by' => $users->first()->id,
                'reviewed_at' => now()->subDays(1),
                'review_notes' => 'Educational content approved.',
            ],
            [
                'content' => 'Buy now! Amazing discount! Limited time offer! Don\'t miss out!',
                'review_status' => 'rejected',
                'reviewed_by' => $users->first()->id,
                'reviewed_at' => now()->subHours(5),
                'review_notes' => 'Too aggressive and spammy. Please revise the tone.',
            ],
        ];

        foreach ($samplePosts as $postData) {
            $post = Post::create([
                'team_id' => $team->id,
                'user_id' => $users->random()->id,
                'content' => $postData['content'],
                'post_type' => 'text',
                'ai_tone' => 'professional',
                'published_at' => now()->addDays(rand(1, 7)),
                'is_draft' => false,
                'review_status' => $postData['review_status'],
                'reviewed_by' => $postData['reviewed_by'] ?? null,
                'reviewed_at' => $postData['reviewed_at'] ?? null,
                'review_notes' => $postData['review_notes'] ?? null,
                'review_flags' => $postData['review_flags'] ?? null,
            ]);

            // Attach random channels to the post
            $randomChannels = $channels->random(rand(1, min(3, $channels->count())));
            $post->channels()->attach($randomChannels->pluck('id'));
        }

        $this->command->info('Review queue sample data created successfully!');
    }
}
