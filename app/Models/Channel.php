<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Channel extends Model
{
    use HasFactory;

    protected $appends = [
        'title',
    ];

    protected $fillable = [
        'team_id',
        'user_id',
        'platform_id',
        'platform',
        'type',
        'name',
        'access_token',
        'access_token_expires_at',
        'access_token_secret',
        'refresh_token',
    ];

    public function getTitleAttribute(): string
    {
        return $this->name.' - '.ucfirst($this->platform).' ('.$this->type.')';
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }

    public function analytics(): HasMany
    {
        return $this->hasMany(PostAnalytics::class);
    }

    protected function casts(): array
    {
        return [
            'access_token_expires_at' => 'datetime',
        ];
    }
}
