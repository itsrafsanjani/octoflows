<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class TrendingTopic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'platform',
        'engagement_score',
        'mentions_count',
        'growth_rate',
        'metadata',
        'trending_since',
        'last_updated',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'trending_since' => 'datetime',
            'last_updated' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope to get active trending topics
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get topics by platform
     */
    public function scopeByPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    /**
     * Scope to order by engagement score
     */
    public function scopeOrderByEngagement($query)
    {
        return $query->orderBy('engagement_score', 'desc');
    }

    /**
     * Scope to get recent trending topics
     */
    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('last_updated', '>=', now()->subHours($hours));
    }
}
