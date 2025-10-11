<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\Team;
use App\Models\User;
use App\Models\Channel;

use function Pest\Laravel\actingAs;

it('displays the post archive page', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $response = actingAs($user)
        ->get(route('posts.archive'))
        ->assertOk();
    
    // Check if it's a proper Inertia response
    $this->assertTrue($response->headers->get('Content-Type') === 'application/json' || 
                     str_contains($response->headers->get('Content-Type'), 'application/json'));
    
    $response->assertInertia(fn ($page) => $page
        ->component('Posts/Archive')
        ->has('posts')
        ->has('filters')
        ->has('statistics')
    );
});

it('filters posts by type', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    // Create test posts
    Post::factory()->single()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Single post content',
    ]);

    Post::factory()->campaign()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Campaign post content',
    ]);

    actingAs($user)
        ->get(route('posts.archive', ['type' => 'single']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('posts.data', 1)
            ->where('posts.data.0.content', 'Single post content')
        );
});

it('filters posts by status', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    // Create published post
    Post::factory()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Published post',
        'published_at' => now()->subDay(),
    ]);

    // Create scheduled post
    Post::factory()->scheduled()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Scheduled post',
        'published_at' => now()->addDay(),
    ]);

    actingAs($user)
        ->get(route('posts.archive', ['status' => 'published']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('posts.data', 1)
            ->where('posts.data.0.content', 'Published post')
        );
});

it('can requeue a post', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $post = Post::factory()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'is_draft' => false,
        'published_at' => now()->subDay(),
    ]);

    actingAs($user)
        ->post(route('posts.requeue', $post->id))
        ->assertRedirect();
    
    expect($post->fresh())
        ->is_draft->toBeTrue();
});

it('can repost a post', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $originalPost = Post::factory()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Original post content',
    ]);

    actingAs($user)
        ->post(route('posts.repost', $originalPost->id))
        ->assertRedirect();
    
    expect(Post::where('content', 'Original post content')->count())->toBe(2);
});

it('can delete a post from archive', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $post = Post::factory()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->delete(route('posts.archive.destroy', $post->id))
        ->assertRedirect();
    
    expect(Post::find($post->id))->toBeNull();
});

it('can clear the entire archive', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    // Create some published posts
    Post::factory()->count(3)->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    // Create some draft posts (should not be deleted)
    Post::factory()->count(2)->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'is_draft' => true,
    ]);

    actingAs($user)
        ->delete(route('posts.archive.clear'))
        ->assertRedirect();
    
    // Only draft posts should remain
    expect(Post::where('is_draft', false)->count())->toBe(0);
    expect(Post::where('is_draft', true)->count())->toBe(2);
});

it('can export archive data', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $post = Post::factory()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Test post content',
        'post_type' => 'single',
    ]);

    actingAs($user)
        ->get(route('posts.archive.export'))
        ->assertOk()
        ->assertHeader('Content-Type', 'text/csv; charset=UTF-8')
        ->assertHeader('Content-Disposition', function ($value) { return str_contains($value, 'attachment'); })
        ->assertSee('Post Type,Content,Platforms,Published At,Status')
        ->assertSee('single,Test post content');
});

it('can view a specific archived post', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    $post = Post::factory()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'content' => 'Test post content',
    ]);

    actingAs($user)
        ->get(route('posts.view', $post->id))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Posts/View')
            ->has('post')
            ->where('post.content', 'Test post content')
        );
});

it('calculates archive statistics correctly', function () {
    $user = User::factory()->withPersonalTeam()->create();
    $team = $user->currentTeam;

    // Create posts for statistics
    Post::factory()->count(10)->single()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    Post::factory()->count(5)->campaign()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
    ]);

    // Create a post from this month
    Post::factory()->single()->published()->create([
        'team_id' => $team->id,
        'user_id' => $user->id,
        'published_at' => now()->startOfMonth()->addDays(5),
    ]);

    actingAs($user)
        ->get(route('posts.archive'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('statistics.total', 16)
            ->where('statistics.single_posts', 11)
            ->where('statistics.campaign_posts', 5)
            ->where('statistics.this_month', 1)
        );
});