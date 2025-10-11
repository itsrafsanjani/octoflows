<?php

declare(strict_types=1);

use App\Enums\ChannelPlatformKey;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TrendingController;
use App\Http\Controllers\User\OauthController;
use App\Http\Controllers\ReviewQueueController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\User\LoginLinkController;

Route::get('/', [WelcomeController::class, 'home'])->name('home');

Route::prefix('auth')->group(
    function () {
        // OAuth
        Route::get('/redirect/{provider}', [OauthController::class, 'redirect'])->name('oauth.redirect');
        Route::get('/callback/{provider}', [OauthController::class, 'callback'])->name('oauth.callback');
        // Magic Link
        Route::middleware('throttle:login-link')->group(function () {
            Route::post('/login-link', [LoginLinkController::class, 'store'])->name('login-link.store');
            Route::get('/login-link/{token}', [LoginLinkController::class, 'login'])
                ->name('login-link.login')
                ->middleware('signed');
        });
    }
);

Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::delete('/auth/destroy/{provider}', [OauthController::class, 'destroy'])->name('oauth.destroy');

    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');

    Route::get('/trending', [TrendingController::class, 'index'])->name('trending.index');
    Route::get('/api/trending/topics', [TrendingController::class, 'topics'])->name('trending.topics');
    Route::get('/api/trending/hashtags', [TrendingController::class, 'hashtags'])->name('trending.hashtags');
    Route::get('/api/trending/viral-posts', [TrendingController::class, 'viralPosts'])->name('trending.viral-posts');

    Route::resource('/subscriptions', SubscriptionController::class)
        ->names('subscriptions')
        ->only(['index', 'create', 'store', 'show']);

    // Social Media Post Scheduling Routes
    Route::get('/channels/{provider}/redirect', [ChannelController::class, 'redirect'])
        ->whereIn('provider', array_column(ChannelPlatformKey::cases(), 'value'))
        ->name('channels.redirect');
    Route::get('/channels/{provider}/callback', [ChannelController::class, 'callback'])
        ->name('channels.callback');

    Route::resource('/channels', ChannelController::class);

    Route::get('/posts/calendar', [PostController::class, 'calendar'])->name('posts.calendar');
    Route::resource('/posts', PostController::class);

    // Review Queue Routes
    Route::get('/review-queue', [ReviewQueueController::class, 'index'])->name('review-queue.index');
    Route::post('/posts/{post}/approve', [ReviewQueueController::class, 'approve'])->name('posts.approve');
    Route::post('/posts/{post}/reject', [ReviewQueueController::class, 'reject'])->name('posts.reject');
    Route::patch('/posts/{post}/flags', [ReviewQueueController::class, 'updateFlags'])->name('posts.update-flags');
});
