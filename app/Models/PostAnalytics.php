<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

final class PostAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'channel_id',
        'platform',
        'platform_post_id',
        'impressions',
        'reach',
        'engagement',
        'likes',
        'shares',
        'comments',
        'clicks',
        'saves',
        'engagement_rate',
        'click_through_rate',
        'analytics_date',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class);
    }

    protected function casts(): array
    {
        return [
            'analytics_date' => 'date',
            'engagement_rate' => 'decimal:2',
            'click_through_rate' => 'decimal:2',
        ];
    }
}
