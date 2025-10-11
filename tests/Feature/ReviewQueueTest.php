<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\Team;
use App\Models\User;
use App\Models\Channel;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->team = Team::factory()->create([
        'user_id' => $this->user->id,
    ]);
    $this->user->current_team_id = $this->team->id;
    $this->user->save();
});

it('displays the review queue page', function () {
    $response = $this->actingAs($this->user)->get(route('review-queue.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('ReviewQueue/Index')
        ->has('posts')
        ->has('stats')
        ->has('teamMembers')
        ->has('platforms')
    );
});

it('shows pending posts by default', function () {
    // Create a pending post
    $pendingPost = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);

    // Create an approved post
    Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'approved',
        'is_draft' => false,
    ]);

    $response = $this->actingAs($this->user)->get(route('review-queue.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('ReviewQueue/Index')
        ->has('posts.data', 1)
        ->where('posts.data.0.id', $pendingPost->id)
    );
});

it('filters posts by status', function () {
    // Create posts with different statuses
    Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);

    $approvedPost = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'approved',
        'is_draft' => false,
    ]);

    $response = $this->actingAs($this->user)->get(route('review-queue.index', ['status' => 'approved']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('ReviewQueue/Index')
        ->has('posts.data', 1)
        ->where('posts.data.0.id', $approvedPost->id)
    );
});

it('approves a post successfully', function () {
    $post = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);

    $response = $this->actingAs($this->user)->post(route('posts.approve', $post), [
        'review_notes' => 'Great post!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('flash.banner', 'Post approved successfully.');

    $post->refresh();
    expect($post->review_status)->toBe('approved');
    expect($post->reviewed_by)->toBe($this->user->id);
    expect($post->review_notes)->toBe('Great post!');
    expect($post->reviewed_at)->not->toBeNull();
});

it('rejects a post successfully', function () {
    $post = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);

    $response = $this->actingAs($this->user)->post(route('posts.reject', $post), [
        'review_notes' => 'Please revise the content.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('flash.banner', 'Post rejected successfully.');

    $post->refresh();
    expect($post->review_status)->toBe('rejected');
    expect($post->reviewed_by)->toBe($this->user->id);
    expect($post->review_notes)->toBe('Please revise the content.');
    expect($post->reviewed_at)->not->toBeNull();
});

it('requires review notes when rejecting a post', function () {
    $post = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);

    $response = $this->actingAs($this->user)->post(route('posts.reject', $post), [
        'review_notes' => '',
    ]);

    $response->assertSessionHasErrors('review_notes');

    $post->refresh();
    expect($post->review_status)->toBe('pending');
});

it('filters posts by platform', function () {
    // Create channels
    $twitterChannel = Channel::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'platform' => 'twitter',
    ]);

    $facebookChannel = Channel::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'platform' => 'facebook',
    ]);

    // Create posts with different platforms
    $twitterPost = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);
    $twitterPost->channels()->attach($twitterChannel);

    $facebookPost = Post::factory()->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);
    $facebookPost->channels()->attach($facebookChannel);

    $response = $this->actingAs($this->user)->get(route('review-queue.index', ['platform' => 'twitter']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('ReviewQueue/Index')
        ->has('posts.data', 1)
        ->where('posts.data.0.id', $twitterPost->id)
    );
});

it('calculates review statistics correctly', function () {
    // Create posts with different statuses
    Post::factory()->count(3)->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'pending',
        'is_draft' => false,
    ]);

    Post::factory()->count(2)->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'approved',
        'is_draft' => false,
    ]);

    Post::factory()->count(1)->create([
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'review_status' => 'rejected',
        'is_draft' => false,
    ]);

    $response = $this->actingAs($this->user)->get(route('review-queue.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('ReviewQueue/Index')
        ->where('stats.pending', 3)
        ->where('stats.approved', 2)
        ->where('stats.rejected', 1)
        ->where('stats.total', 6)
    );
});
