<?php

declare(strict_types=1);

use Carbon\Carbon;
use App\Models\Post;
use App\Models\User;
use App\Models\Channel;
use App\Models\PostAnalytics;

beforeEach(function () {
    $this->user = User::factory()->withPersonalTeam()->create();
    $this->actingAs($this->user);
});

it('displays analytics dashboard', function () {
    $response = $this->get(route('analytics.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->has('kpis')
        ->has('engagementOverTime')
        ->has('platformPerformance')
        ->has('postPerformance')
        ->has('bestPerformingContent')
    );
});

it('calculates KPIs correctly', function () {
    // Create a channel
    $channel = Channel::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'platform' => 'twitter',
    ]);

    // Create a post
    $post = Post::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'published_at' => Carbon::now()->subDays(5),
        'is_draft' => false,
    ]);

    // Attach channel to post
    $post->channels()->attach($channel);

    // Create analytics data
    PostAnalytics::factory()->create([
        'post_id' => $post->id,
        'channel_id' => $channel->id,
        'platform' => 'twitter',
        'impressions' => 10000,
        'engagement' => 500,
        'clicks' => 100,
        'analytics_date' => Carbon::now()->subDays(5),
    ]);

    $response = $this->get(route('analytics.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->has('kpis')
    );

    $kpis = $response->viewData('page')['props']['kpis'];
    expect($kpis['totalImpressions']['value'])->toBe(10000);
    expect($kpis['totalClicks']['value'])->toBe(100);
    expect($kpis['engagementRate']['value'])->toBe(5.0);
});

it('filters analytics by date range', function () {
    $response = $this->get(route('analytics.index', ['date_range' => '7']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->where('dateRange', '7')
    );
});

it('filters analytics by granularity', function () {
    $response = $this->get(route('analytics.index', ['granularity' => 'week']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->where('granularity', 'week')
    );
});

it('requires authentication', function () {
    Auth::logout();

    $response = $this->get(route('analytics.index'));

    $response->assertRedirect(route('login'));
});

it('shows platform performance data', function () {
    // Create channels for different platforms
    $twitterChannel = Channel::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'platform' => 'twitter',
    ]);

    $facebookChannel = Channel::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'platform' => 'facebook',
    ]);

    $redditChannel = Channel::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'platform' => 'reddit',
    ]);

    $youtubeChannel = Channel::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'platform' => 'youtube',
    ]);

    $response = $this->get(route('analytics.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->has('platformPerformance', 4)
    );
});

it('handles empty analytics data gracefully', function () {
    // No posts or analytics data
    $response = $this->get(route('analytics.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->has('kpis')
        ->has('engagementOverTime')
        ->has('platformPerformance')
        ->has('postPerformance')
        ->has('bestPerformingContent')
    );
});

it('supports all new social media platforms', function () {
    // Create channels for all new platforms
    $platforms = ['reddit', 'youtube', 'tiktok', 'pinterest', 'snapchat', 'discord', 'twitch'];

    foreach ($platforms as $platform) {
        Channel::factory()->create([
            'team_id' => $this->user->currentTeam->id,
            'platform' => $platform,
        ]);
    }

    $response = $this->get(route('analytics.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->has('platformPerformance', count($platforms))
    );
});

it('filters analytics by new platform', function () {
    // Create a Reddit channel and post
    $redditChannel = Channel::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'platform' => 'reddit',
    ]);

    $post = Post::factory()->create([
        'team_id' => $this->user->currentTeam->id,
        'published_at' => Carbon::now()->subDays(5),
        'is_draft' => false,
    ]);

    $post->channels()->attach($redditChannel);

    PostAnalytics::factory()->create([
        'post_id' => $post->id,
        'channel_id' => $redditChannel->id,
        'platform' => 'reddit',
        'impressions' => 5000,
        'engagement' => 250,
        'clicks' => 50,
        'analytics_date' => Carbon::now()->subDays(5),
    ]);

    $response = $this->get(route('analytics.index', ['platform' => 'reddit']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Analytics/Index')
        ->has('postPerformance')
    );
});
