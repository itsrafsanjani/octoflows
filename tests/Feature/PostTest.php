<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\Team;
use App\Models\User;
use App\Models\Channel;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    Storage::fake('local');
});

test('posts index page displays posts for current team', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $posts = Post::factory()->count(3)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->get(route('posts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Index')
            ->has('posts.data', 3));
});

test('posts create page displays available channels', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channels = Channel::factory()->count(2)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->get(route('posts.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/Create')
            ->has('channels', 2));
});

test('user can create post with channels', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channels = Channel::factory()->count(2)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $postData = [
        'content' => 'Test post content',
        'channels' => $channels->pluck('id')->toArray(),
        'is_scheduled' => false,
        'published_at' => now()->toISOString(),
    ];

    actingAs($user)
        ->post(route('posts.store'), $postData)
        ->assertRedirect(route('posts.index'));

    assertDatabaseHas('posts', [
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Test post content',
    ]);

    $post = Post::where('content', 'Test post content')->first();
    expect($post->channels)->toHaveCount(2);
});

test('user can create scheduled post', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $futureDate = now()->addHours(2);

    $postData = [
        'content' => 'Scheduled post content',
        'channels' => [$channel->id],
        'is_scheduled' => true,
        'published_at' => $futureDate->toISOString(),
    ];

    actingAs($user)
        ->post(route('posts.store'), $postData)
        ->assertRedirect(route('posts.index'));

    assertDatabaseHas('posts', [
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Scheduled post content',
    ]);

    $post = Post::where('content', 'Scheduled post content')->first();
    expect($post->published_at->toDateTimeString())
        ->toBe($futureDate->toDateTimeString());
});

test('user can create post with media', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $channel = Channel::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $file = UploadedFile::fake()->image('test.jpg');

    $postData = [
        'content' => 'Post with media',
        'channels' => [$channel->id],
        'media' => [$file],
        'is_scheduled' => false,
        'published_at' => now()->toISOString(),
    ];

    actingAs($user)
        ->post(route('posts.store'), $postData)
        ->assertRedirect(route('posts.index'));

    $post = Post::where('content', 'Post with media')->first();
    expect($post->media)->toBeArray();
    expect($post->media)->toHaveCount(1);
    expect($post->media[0])->toHaveKeys(['id', 'name', 'filetype', 'size', 'path']);
});

test('post requires content', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $channel = Channel::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->post(route('posts.store'), [
            'content' => '',
            'channels' => [$channel->id],
            'is_scheduled' => false,
            'published_at' => now()->toISOString(),
        ])
        ->assertSessionHasErrors('content');
});

test('post requires at least one channel', function () {
    $user = User::factory()->withPersonalTeam()->create();

    actingAs($user)
        ->post(route('posts.store'), [
            'content' => 'Test content',
            'channels' => [],
            'is_scheduled' => false,
            'published_at' => now()->toISOString(),
        ])
        ->assertSessionHasErrors('channels');
});

test('post belongs to team', function () {
    $team = Team::factory()->create();
    $post = Post::factory()->create(['team_id' => $team->id]);

    expect($post->team)->toBeInstanceOf(Team::class);
    expect($post->team->id)->toBe($team->id);
});

test('post belongs to user', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $post = Post::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    expect($post->user)->toBeInstanceOf(User::class);
    expect($post->user->id)->toBe($user->id);
});

test('post has many channels', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $post = Post::factory()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $channels = Channel::factory()->count(3)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    $post->channels()->attach($channels->pluck('id'));

    expect($post->channels)->toHaveCount(3);
});
