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
        'content',
        'media',
        'published_at',
        'is_picked_by_job',
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
            'published_at' => 'datetime',
            'is_picked_by_job' => 'boolean',
        ];
    }
}
