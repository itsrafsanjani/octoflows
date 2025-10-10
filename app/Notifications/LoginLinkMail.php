<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\LoginLink;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\URL;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

final class LoginLinkMail extends Notification
{
    use Queueable;

    private readonly string $magicLinkUrl;

    public function __construct(private readonly LoginLink $magicLink)
    {
        $this->magicLinkUrl = URL::signedRoute('login-link.login', ['token' => $this->magicLink->token]);
    }

    /**
     * @return array<int, string>
     */
    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Magic Login Link')
            ->line('Click the button below to log in.')
            ->action('Log In', $this->magicLinkUrl)
            ->line('This link will expire in 15 minutes.')
            ->line('If you did not request this link, no action is needed.');
    }
}
