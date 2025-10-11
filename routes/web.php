<?php

declare(strict_types=1);

use App\Enums\ChannelPlatformKey;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\User\OauthController;
use App\Http\Controllers\PostArchiveController;
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

    Route::resource('/posts', PostController::class);

    // Post Archive Routes
    Route::get('/posts/archive', [PostArchiveController::class, 'index'])->name('posts.archive');
    Route::post('/posts/{id}/requeue', [PostArchiveController::class, 'requeue'])->name('posts.requeue');
    Route::post('/posts/{id}/repost', [PostArchiveController::class, 'repost'])->name('posts.repost');
    Route::get('/posts/{id}/view', [PostArchiveController::class, 'view'])->name('posts.view');
    Route::delete('/posts/{id}/archive', [PostArchiveController::class, 'destroy'])->name('posts.archive.destroy');
    Route::delete('/posts/archive/clear', [PostArchiveController::class, 'clearArchive'])->name('posts.archive.clear');
    Route::get('/posts/archive/export', [PostArchiveController::class, 'export'])->name('posts.archive.export');
});
