<?php

declare(strict_types=1);

namespace App\Enums;

enum ChannelPlatform: string
{
    case Facebook = 'facebook';
    case Twitter = 'twitter';
    case Linkedin = 'linkedin';
    case Instagram = 'instagram';
}
