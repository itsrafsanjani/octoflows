<?php

declare(strict_types=1);

use App\Models\Team;
use App\Models\User;
use App\Models\Channel;

use function Pest\Laravel\actingAs;

test('channels index page displays channels for current team', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channels = Channel::factory()->count(3)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->get(route('channels.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Channels/Index')
            ->has('channels.data', 3));
});

test('users can only see channels from their current team', function () {
    $user1 = User::factory()->withPersonalTeam()->create();
    $user2 = User::factory()->withPersonalTeam()->create();

    $channel1 = Channel::factory()->create([
        'team_id' => $user1->currentTeam->id,
        'user_id' => $user1->id,
    ]);

    $channel2 = Channel::factory()->create([
        'team_id' => $user2->currentTeam->id,
        'user_id' => $user2->id,
    ]);

    actingAs($user1)
        ->get(route('channels.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Channels/Index')
            ->has('channels.data', 1)
            ->where('channels.data.0.id', $channel1->id));
});

test('channel belongs to team', function () {
    $team = Team::factory()->create();
    $channel = Channel::factory()->create(['team_id' => $team->id]);

    expect($channel->team)->toBeInstanceOf(Team::class);
    expect($channel->team->id)->toBe($team->id);
});

test('channel belongs to user', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $channel = Channel::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    expect($channel->user)->toBeInstanceOf(User::class);
    expect($channel->user->id)->toBe($user->id);
});

test('channel has title attribute', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $channel = Channel::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
        'name' => 'My Page',
        'platform' => 'facebook',
        'type' => 'page',
    ]);

    expect($channel->title)->toBe('My Page - Facebook (page)');
});
