<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\TrendingTopic;
use App\Models\TrendingHashtag;
use App\Models\ViralPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class TrendingTest extends TestCase
{
    use RefreshDatabase;

    public function test_trending_page_loads_successfully(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/trending')
            ->assertStatus(200);
    }

    public function test_trending_topics_api_returns_data(): void
    {
        $user = User::factory()->create();
        TrendingTopic::factory(5)->create();

        $response = $this->actingAs($user)
            ->get('/api/trending/topics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'category',
                        'platform',
                        'engagement_score',
                        'mentions_count',
                        'growth_rate',
                    ]
                ],
                'meta' => [
                    'platform',
                    'category',
                    'total'
                ]
            ]);
    }

    public function test_trending_hashtags_api_returns_data(): void
    {
        $user = User::factory()->create();
        TrendingHashtag::factory(5)->create();

        $response = $this->actingAs($user)
            ->get('/api/trending/hashtags');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'hashtag',
                        'platform',
                        'usage_count',
                        'engagement_score',
                        'growth_rate',
                    ]
                ],
                'meta' => [
                    'platform',
                    'total'
                ]
            ]);
    }

    public function test_viral_posts_api_returns_data(): void
    {
        $user = User::factory()->create();
        ViralPost::factory(5)->create();

        $response = $this->actingAs($user)
            ->get('/api/trending/viral-posts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'external_id',
                        'platform',
                        'content',
                        'author_username',
                        'likes_count',
                        'shares_count',
                        'comments_count',
                        'virality_score',
                    ]
                ],
                'meta' => [
                    'platform',
                    'total'
                ]
            ]);
    }

    public function test_trending_topics_can_be_filtered_by_platform(): void
    {
        $user = User::factory()->create();
        TrendingTopic::factory()->create(['platform' => 'twitter']);
        TrendingTopic::factory()->create(['platform' => 'instagram']);

        $response = $this->actingAs($user)
            ->get('/api/trending/topics?platform=twitter');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('twitter', $data[0]['platform']);
    }

    public function test_trending_hashtags_can_be_filtered_by_platform(): void
    {
        $user = User::factory()->create();
        TrendingHashtag::factory()->create(['platform' => 'twitter']);
        TrendingHashtag::factory()->create(['platform' => 'instagram']);

        $response = $this->actingAs($user)
            ->get('/api/trending/hashtags?platform=twitter');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('twitter', $data[0]['platform']);
    }

    public function test_viral_posts_can_be_filtered_by_platform(): void
    {
        $user = User::factory()->create();
        ViralPost::factory()->create(['platform' => 'twitter']);
        ViralPost::factory()->create(['platform' => 'instagram']);

        $response = $this->actingAs($user)
            ->get('/api/trending/viral-posts?platform=twitter');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('twitter', $data[0]['platform']);
    }
}
