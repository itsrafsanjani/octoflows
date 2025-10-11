<?php

declare(strict_types=1);

namespace App\Enums;

enum ChannelPlatformKey: string
{
    case Facebook = 'facebook';
    case Twitter = 'twitter';
    case Linkedin = 'linkedin';
    case Instagram = 'instagram';
    case Reddit = 'reddit';
    case YouTube = 'youtube';
    case TikTok = 'tiktok';
    case Pinterest = 'pinterest';
    case Snapchat = 'snapchat';
    case Discord = 'discord';
    case Twitch = 'twitch';
}
