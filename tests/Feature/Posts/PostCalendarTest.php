<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;
use App\Models\Channel;

use function Pest\Laravel\actingAs;

test('calendar page is accessible for authenticated users', function (): void {
    $user = User::factory()->withPersonalTeam()->create();

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts')
            ->has('channels')
            ->has('groupedChannels'));
});

test('calendar page displays scheduled posts', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $post = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'published_at' => now()->addDays(3),
    ]);

    $post->channels()->attach($channel->id);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 1)
            ->where('posts.0.id', $post->id)
            ->where('posts.0.content', $post->content));
});

test('calendar displays posts with their associated channels', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channels = Channel::factory()->count(3)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $post = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'published_at' => now()->addDay(),
    ]);

    $post->channels()->attach($channels->pluck('id'));

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 1)
            ->where('posts.0.channels', fn ($postChannels) => count($postChannels) === 3));
});

test('calendar only displays posts for current team', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $otherUser = User::factory()->withPersonalTeam()->create();

    $userChannel = Channel::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    $otherChannel = Channel::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'user_id' => $otherUser->id,
    ]);

    $userPost = Post::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
        'content' => 'User post',
        'published_at' => now()->addDay(),
    ]);
    $userPost->channels()->attach($userChannel->id);

    $otherPost = Post::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'user_id' => $otherUser->id,
        'content' => 'Other user post',
        'published_at' => now()->addDay(),
    ]);
    $otherPost->channels()->attach($otherChannel->id);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 1)
            ->where('posts.0.content', 'User post'));
});

test('calendar displays both draft and scheduled posts', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $draftPost = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'published_at' => now()->addDays(1),
        'is_draft' => true,
    ]);
    $draftPost->channels()->attach($channel->id);

    $scheduledPost = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'published_at' => now()->addDays(2),
        'is_draft' => false,
    ]);
    $scheduledPost->channels()->attach($channel->id);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 2)
            ->where('posts.0.is_draft', fn ($isDraft) => is_bool($isDraft))
            ->where('posts.1.is_draft', fn ($isDraft) => is_bool($isDraft)));
});

test('calendar includes post type information', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $textPost = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'post_type' => 'text',
        'published_at' => now()->addDay(),
    ]);
    $textPost->channels()->attach($channel->id);

    $visualPost = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'post_type' => 'visual',
        'published_at' => now()->addDays(2),
    ]);
    $visualPost->channels()->attach($channel->id);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 2)
            ->where('posts.0.post_type', 'text')
            ->where('posts.1.post_type', 'visual'));
});

test('calendar page includes available channels', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channels = Channel::factory()->count(5)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('channels', 5)
            ->has('groupedChannels'));
});

test('calendar requires authentication', function (): void {
    $this->get(route('posts.calendar'))
        ->assertRedirect(route('login'));
});

test('calendar posts are ordered by published date', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $laterPost = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Later post',
        'published_at' => now()->addDays(5),
    ]);
    $laterPost->channels()->attach($channel->id);

    $earlierPost = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Earlier post',
        'published_at' => now()->addDays(2),
    ]);
    $earlierPost->channels()->attach($channel->id);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 2)
            ->where('posts.0.content', 'Earlier post')
            ->where('posts.1.content', 'Later post'));
});

test('calendar includes media information', function (): void {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $post = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'published_at' => now()->addDay(),
        'media' => [
            [
                'id' => 'test-uuid',
                'name' => 'test.jpg',
                'filetype' => 'jpg',
                'size' => 1024,
                'path' => 'media/test.jpg',
            ],
        ],
    ]);
    $post->channels()->attach($channel->id);

    actingAs($user)
        ->get(route('posts.calendar'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Calendar')
            ->has('posts', 1)
            ->has('posts.0.media'));
});
