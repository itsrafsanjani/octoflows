<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::daily()
    ->onOneServer()
    ->group(fn () => [
        Schedule::command('sitemap:generate'),
    ]);

Schedule::everyMinute()
    ->command('posts:publish-scheduled');

// Schedule trending data fetch every 12 hours
Schedule::everyTwelveHours()
    ->command('trending:fetch')
    ->withoutOverlapping()
    ->runInBackground();
