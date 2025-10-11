<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        // Fake data for presentation
        $stats = [
            'total_posts' => 1247,
            'total_engagement' => 125890,
            'pending_review' => 8,
            'scheduled_posts' => 15,
            'weekly_growth' => 12.5,
            'monthly_reach' => 856420,
        ];

        $recentPosts = [
            [
                'id' => 1,
                'content' => 'Just launched our new product! 🚀 Check it out and let us know what you think!',
                'platforms' => ['Twitter', 'Facebook', 'LinkedIn'],
                'engagement' => 2453,
                'reach' => 15678,
                'status' => 'published',
                'published_at' => now()->subHours(2),
            ],
            [
                'id' => 2,
                'content' => 'Behind the scenes at our office 📸 Our team working hard on the next big feature!',
                'platforms' => ['Instagram', 'Facebook'],
                'engagement' => 1876,
                'reach' => 12340,
                'status' => 'published',
                'published_at' => now()->subHours(5),
            ],
            [
                'id' => 3,
                'content' => 'Weekly tips: 5 ways to boost your social media engagement in 2025 💡',
                'platforms' => ['Twitter', 'LinkedIn'],
                'engagement' => 3421,
                'reach' => 21456,
                'status' => 'published',
                'published_at' => now()->subHours(12),
            ],
        ];

        $platformStats = [
            [
                'platform' => 'Twitter',
                'followers' => 45600,
                'engagement_rate' => 4.2,
                'posts_today' => 5,
                'icon' => 'mdi:twitter',
                'color' => 'blue',
            ],
            [
                'platform' => 'Facebook',
                'followers' => 78900,
                'engagement_rate' => 3.8,
                'posts_today' => 3,
                'icon' => 'mdi:facebook',
                'color' => 'blue',
            ],
            [
                'platform' => 'Instagram',
                'followers' => 92300,
                'engagement_rate' => 5.6,
                'posts_today' => 4,
                'icon' => 'mdi:instagram',
                'color' => 'pink',
            ],
            [
                'platform' => 'LinkedIn',
                'followers' => 34500,
                'engagement_rate' => 6.1,
                'posts_today' => 2,
                'icon' => 'mdi:linkedin',
                'color' => 'blue',
            ],
        ];

        $upcomingScheduled = [
            [
                'id' => 10,
                'content' => 'Exciting announcement coming this Friday! Stay tuned 👀',
                'platforms' => ['Twitter', 'Facebook', 'Instagram'],
                'scheduled_at' => now()->addHours(3),
            ],
            [
                'id' => 11,
                'content' => 'Join our webinar tomorrow on social media marketing strategies',
                'platforms' => ['LinkedIn', 'Twitter'],
                'scheduled_at' => now()->addHours(18),
            ],
            [
                'id' => 12,
                'content' => 'Weekend inspiration: Success is not final, failure is not fatal...',
                'platforms' => ['Instagram', 'Facebook'],
                'scheduled_at' => now()->addDays(2),
            ],
        ];

        $engagementData = [
            ['date' => 'Mon', 'engagement' => 2340],
            ['date' => 'Tue', 'engagement' => 3456],
            ['date' => 'Wed', 'engagement' => 2890],
            ['date' => 'Thu', 'engagement' => 4123],
            ['date' => 'Fri', 'engagement' => 3678],
            ['date' => 'Sat', 'engagement' => 2345],
            ['date' => 'Sun', 'engagement' => 1987],
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'platformStats' => $platformStats,
            'upcomingScheduled' => $upcomingScheduled,
            'engagementData' => $engagementData,
        ]);
    }
}
