<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\TrendingTopic;
use App\Models\TrendingHashtag;
use App\Models\ViralPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TrendingController extends Controller
{
    /**
     * Display the trending page
     */
    public function index(Request $request): Response
    {
        $platform = $request->get('platform', 'all');
        $category = $request->get('category', 'all');
        $limit = $request->get('limit', 20);

        // Get trending topics
        $trendingTopics = TrendingTopic::active()
            ->when($platform !== 'all', fn($query) => $query->byPlatform($platform))
            ->when($category !== 'all', fn($query) => $query->where('category', $category))
            ->recent(48) // Last 48 hours
            ->orderByEngagement()
            ->limit($limit)
            ->get();

        // Get trending hashtags
        $trendingHashtags = TrendingHashtag::active()
            ->when($platform !== 'all', fn($query) => $query->byPlatform($platform))
            ->recent(48) // Last 48 hours
            ->orderByEngagement()
            ->limit($limit)
            ->get();

        // Get viral posts
        $viralPosts = ViralPost::active()
            ->when($platform !== 'all', fn($query) => $query->byPlatform($platform))
            ->recent(48) // Last 48 hours
            ->orderByVirality()
            ->limit($limit)
            ->get();

        // Get platform statistics
        $platformStats = $this->getPlatformStats();

        // Get category statistics
        $categoryStats = $this->getCategoryStats();

        return Inertia::render('Trending/Index', [
            'trendingTopics' => $trendingTopics,
            'trendingHashtags' => $trendingHashtags,
            'viralPosts' => $viralPosts,
            'platformStats' => $platformStats,
            'categoryStats' => $categoryStats,
            'filters' => [
                'platform' => $platform,
                'category' => $category,
                'limit' => $limit,
            ],
        ]);
    }

    /**
     * Get trending topics for API
     */
    public function topics(Request $request)
    {
        $platform = $request->get('platform', 'all');
        $category = $request->get('category', 'all');
        $limit = $request->get('limit', 10);

        $topics = TrendingTopic::active()
            ->when($platform !== 'all', fn($query) => $query->byPlatform($platform))
            ->when($category !== 'all', fn($query) => $query->where('category', $category))
            ->recent(48)
            ->orderByEngagement()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $topics,
            'meta' => [
                'platform' => $platform,
                'category' => $category,
                'total' => $topics->count(),
            ],
        ]);
    }

    /**
     * Get trending hashtags for API
     */
    public function hashtags(Request $request)
    {
        $platform = $request->get('platform', 'all');
        $limit = $request->get('limit', 10);

        $hashtags = TrendingHashtag::active()
            ->when($platform !== 'all', fn($query) => $query->byPlatform($platform))
            ->recent(48)
            ->orderByEngagement()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $hashtags,
            'meta' => [
                'platform' => $platform,
                'total' => $hashtags->count(),
            ],
        ]);
    }

    /**
     * Get viral posts for API
     */
    public function viralPosts(Request $request)
    {
        $platform = $request->get('platform', 'all');
        $limit = $request->get('limit', 10);

        $posts = ViralPost::active()
            ->when($platform !== 'all', fn($query) => $query->byPlatform($platform))
            ->recent(48)
            ->orderByVirality()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $posts,
            'meta' => [
                'platform' => $platform,
                'total' => $posts->count(),
            ],
        ]);
    }

    /**
     * Get platform statistics
     */
    private function getPlatformStats(): array
    {
        $platforms = ['twitter', 'instagram', 'facebook', 'tiktok', 'linkedin'];

        return collect($platforms)->map(function ($platform) {
            return [
                'platform' => $platform,
                'topics_count' => TrendingTopic::active()->byPlatform($platform)->recent(48)->count(),
                'hashtags_count' => TrendingHashtag::active()->byPlatform($platform)->recent(48)->count(),
                'viral_posts_count' => ViralPost::active()->byPlatform($platform)->recent(48)->count(),
            ];
        })->toArray();
    }

    /**
     * Get category statistics
     */
    private function getCategoryStats(): array
    {
        $categories = TrendingTopic::active()
            ->recent(48)
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return $categories->map(function ($category) {
            return [
                'category' => $category,
                'topics_count' => TrendingTopic::active()->where('category', $category)->recent(48)->count(),
            ];
        })->toArray();
    }
}
