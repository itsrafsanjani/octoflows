<?php

declare(strict_types=1);

namespace App\Enums;

enum ChannelType: string
{
    case Page = 'page';
    case Group = 'group';
    case Account = 'account';
}
