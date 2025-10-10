<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\LoginLink;
use Carbon\CarbonImmutable;

covers(LoginLink::class);

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

describe('login link model tests', function (): void {
    test('login link belongs to a user', function (): void {
        $loginLink = LoginLink::factory()->create([
            'user_id' => $this->user->id,
        ]);

        expect($loginLink->user)
            ->toBeInstanceOf(User::class)
            ->id->toBe($this->user->id);
    });

    test('login link casts dates correctly', function (): void {
        $loginLink = LoginLink::factory()->create([
            'expires_at' => now()->addMinutes(15),
            'used_at' => now(),
        ]);

        expect($loginLink)
            ->expires_at->toBeInstanceOf(CarbonImmutable::class)
            ->used_at->toBeInstanceOf(CarbonImmutable::class);
    });

    test('login link cascades on user deletion', function (): void {
        $user = User::factory()->create();
        $loginLink = LoginLink::factory()->create([
            'user_id' => $user->id,
        ]);

        $user->delete();
        expect(LoginLink::query()->find($loginLink->id))->toBeNull();
    });
});
