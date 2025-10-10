<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\LoginLinkFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $used_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 *
 * @method static \Database\Factories\LoginLinkFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereUsedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginLink whereUserId($value)
 *
 * @mixin \Eloquent
 */
final class LoginLink extends Model
{
    /** @use HasFactory<LoginLinkFactory> */
    use HasFactory;

    use MassPrunable;

    protected $guarded = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    /**
     * Get the user that the magic link belongs to.
     *
     * @return BelongsTo<User, covariant $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the prunable model query.
     * This will delete all magic links that were created more than a week ago.
     */
    public function prunable(): Builder
    {
        return self::query()->where('expires_at', '<=', Date::now())->toBase();
    }
}
