<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Team;
use App\Models\Channel;
use Illuminate\Database\Seeder;

final class ChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = Team::first();
        if (! $team) {
            $this->command->info('No team found. Please create a team first.');

            return;
        }

        $channels = [
            [
                'name' => 'Twitter Account',
                'platform' => 'twitter',
                'type' => 'profile',
                'platform_id' => '123456789',
                'access_token' => 'sample_access_token',
                'access_token_expires_at' => now()->addDays(30),
                'refresh_token' => 'sample_refresh_token',
            ],
            [
                'name' => 'Facebook Page',
                'platform' => 'facebook',
                'type' => 'page',
                'platform_id' => '987654321',
                'access_token' => 'sample_access_token',
                'access_token_expires_at' => now()->addDays(30),
                'refresh_token' => 'sample_refresh_token',
            ],
            [
                'name' => 'Instagram Business',
                'platform' => 'instagram',
                'type' => 'business',
                'platform_id' => '555666777',
                'access_token' => 'sample_access_token',
                'access_token_expires_at' => now()->addDays(30),
                'refresh_token' => 'sample_refresh_token',
            ],
        ];

        foreach ($channels as $channelData) {
            Channel::create([
                'team_id' => $team->id,
                'user_id' => $team->user_id,
                ...$channelData,
            ]);
        }

        $this->command->info('Sample channels created successfully!');
    }
}
