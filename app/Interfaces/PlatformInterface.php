<?php

declare(strict_types=1);

namespace App\Interfaces;

use App\Models\Post;

interface PlatformInterface
{
    public function post(Post $post);
}
