<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'user_id',
        'post_type',
        'ai_tone',
        'content',
        'media',
        'platform_configs',
        'published_at',
        'is_picked_by_job',
        'is_draft',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function channels(): BelongsToMany
    {
        return $this->belongsToMany(Channel::class);
    }

    protected function casts(): array
    {
        return [
            'media' => 'array',
            'platform_configs' => 'array',
            'published_at' => 'datetime',
            'is_picked_by_job' => 'boolean',
            'is_draft' => 'boolean',
        ];
    }
}
