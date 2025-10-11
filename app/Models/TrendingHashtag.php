<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class TrendingHashtag extends Model
{
    use HasFactory;

    protected $fillable = [
        'hashtag',
        'platform',
        'usage_count',
        'engagement_score',
        'growth_rate',
        'related_topics',
        'metadata',
        'trending_since',
        'last_updated',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'related_topics' => 'array',
            'metadata' => 'array',
            'trending_since' => 'datetime',
            'last_updated' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope to get active trending hashtags
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get hashtags by platform
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
     * Scope to get recent trending hashtags
     */
    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('last_updated', '>=', now()->subHours($hours));
    }

    /**
     * Get the hashtag with # prefix
     */
    public function getFormattedHashtagAttribute(): string
    {
        return str_starts_with($this->hashtag, '#') ? $this->hashtag : '#' . $this->hashtag;
    }
}
