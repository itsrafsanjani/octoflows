<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class ViralPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'platform',
        'content',
        'author_username',
        'author_name',
        'likes_count',
        'shares_count',
        'comments_count',
        'engagement_score',
        'virality_score',
        'hashtags',
        'media_urls',
        'metadata',
        'published_at',
        'discovered_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'hashtags' => 'array',
            'media_urls' => 'array',
            'metadata' => 'array',
            'published_at' => 'datetime',
            'discovered_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope to get active viral posts
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get posts by platform
     */
    public function scopeByPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    /**
     * Scope to order by virality score
     */
    public function scopeOrderByVirality($query)
    {
        return $query->orderBy('virality_score', 'desc');
    }

    /**
     * Scope to order by engagement score
     */
    public function scopeOrderByEngagement($query)
    {
        return $query->orderBy('engagement_score', 'desc');
    }

    /**
     * Scope to get recent viral posts
     */
    public function scopeRecent($query, int $hours = 24)
    {
        return $query->where('discovered_at', '>=', now()->subHours($hours));
    }

    /**
     * Get the total engagement count
     */
    public function getTotalEngagementAttribute(): int
    {
        return $this->likes_count + $this->shares_count + $this->comments_count;
    }
}
