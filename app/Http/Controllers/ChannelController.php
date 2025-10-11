<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Exception;
use Inertia\Response;
use App\Enums\ChannelType;
use Inertia\ResponseFactory;
use App\Enums\ChannelPlatform;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

final class ChannelController extends Controller
{
    /**
     * @return Response|ResponseFactory
     */
    public function index()
    {
        return inertia('Channels/Index', [
            'channels' => auth()->user()->currentTeam->channels()->paginate(),
        ]);
    }

    /**
     * @throws Exception
     */
    public function redirect($provider)
    {
        return match ($provider) {
            'facebook' => Socialite::driver($provider)
                ->stateless()
                ->scopes([
                    'pages_show_list',
                    'pages_manage_posts',
                    'pages_manage_engagement',
                    'business_management',
                    'read_insights',
                ])
                ->redirect(),
            'twitter' => Socialite::driver($provider)->stateless()->redirect(),
            'linkedin' => Socialite::driver($provider)->stateless()->redirect(),
            default => throw new Exception('Invalid provider.'),
        };
    }

    /**
     * @throws Exception
     */
    public function callback($provider)
    {
        try {
            $user = Socialite::driver($provider)->stateless()->user();

            match ($provider) {
                'facebook' => [
                    $this->getFacebookPages($user->token),
                    $this->getFacebookGroups($user->token),
                    $this->getInstagramAccounts($user->token),
                ],
                'twitter' => $this->getTwitterAccount($user),
                'linkedin' => dd($user),
            };

            return to_route('channels.index');
        } catch (Exception $exception) {
            logger()->error('OAuth callback error', [
                'provider' => $provider,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getFacebookPages($accessToken): bool
    {
        $response = Http::get('https://graph.facebook.com/v21.0/me/accounts', [
            'access_token' => $accessToken,
            'fields' => 'id,name,access_token,category,tasks',
        ]);

        if ($response->failed()) {
            $error = $response->json()['error']['message'] ?? 'Failed to get Facebook pages.';
            logger()->error('Facebook Pages API error', [
                'error' => $error,
                'response' => $response->json(),
            ]);
            throw new Exception($error);
        }

        $pages = collect($response->json()['data'] ?? []);

        if ($pages->isEmpty()) {
            logger()->warning('No Facebook pages found for user', [
                'user_id' => auth()->id(),
            ]);

            return true;
        }

        $pages->each(function (array $page): void {
            auth()->user()->currentTeam->channels()->updateOrCreate([
                'platform_id' => $page['id'],
            ], [
                'user_id' => auth()->id(),
                'platform' => ChannelPlatform::Facebook,
                'type' => ChannelType::Page,
                'name' => $page['name'],
                'access_token' => $page['access_token'],
            ]);
        });

        return true;
    }

    /**
     * @throws Exception
     */
    public function getFacebookGroups($accessToken): bool
    {
        $response = Http::get('https://graph.facebook.com/v21.0/me/groups', [
            'access_token' => $accessToken,
            'fields' => 'id,name,administrator',
        ]);

        if ($response->failed()) {
            $error = $response->json()['error']['message'] ?? 'Failed to get Facebook groups.';
            logger()->error('Facebook Groups API error', [
                'error' => $error,
                'response' => $response->json(),
            ]);
            throw new Exception($error);
        }

        $groups = collect($response->json()['data'] ?? []);

        if ($groups->isEmpty()) {
            logger()->info('No Facebook groups found for user', [
                'user_id' => auth()->id(),
            ]);

            return true;
        }

        $groups->each(function (array $group) use ($accessToken): void {
            auth()->user()->currentTeam->channels()->updateOrCreate([
                'platform_id' => $group['id'],
            ], [
                'user_id' => auth()->id(),
                'platform' => ChannelPlatform::Facebook,
                'type' => ChannelType::Group,
                'name' => $group['name'],
                'access_token' => $accessToken,
            ]);
        });

        return true;
    }

    /**
     * @throws Exception
     */
    public function getInstagramAccounts($accessToken): bool
    {
        $response = Http::get('https://graph.facebook.com/v21.0/me/accounts', [
            'access_token' => $accessToken,
            'fields' => 'id,name,access_token,instagram_business_account',
        ]);

        if ($response->failed()) {
            $error = $response->json()['error']['message'] ?? 'Failed to get Facebook pages which needs to get Instagram accounts.';
            logger()->error('Instagram Accounts API error', [
                'error' => $error,
                'response' => $response->json(),
            ]);
            throw new Exception($error);
        }

        $pages = collect($response->json()['data'] ?? []);

        if ($pages->isEmpty()) {
            logger()->info('No Facebook pages found for Instagram lookup', [
                'user_id' => auth()->id(),
            ]);

            return true;
        }

        $pages->each(function ($page) use ($accessToken): void {
            // Check if Instagram account is already in the response
            $instagramId = $page['instagram_business_account']['id'] ?? null;

            if (! $instagramId) {
                // Try to fetch it separately if not included
                $fbPageInstagramAccountResponse = Http::get("https://graph.facebook.com/v21.0/{$page['id']}", [
                    'access_token' => $page['access_token'] ?? $accessToken,
                    'fields' => 'instagram_business_account',
                ]);

                if ($fbPageInstagramAccountResponse->failed()) {
                    logger()->warning('Failed to get Instagram account for page', [
                        'page_id' => $page['id'],
                        'error' => $fbPageInstagramAccountResponse->json()['error']['message'] ?? 'Unknown error',
                    ]);

                    return;
                }

                $instagramId = $fbPageInstagramAccountResponse->json()['instagram_business_account']['id'] ?? null;
            }

            if (! $instagramId) {
                return;
            }

            $instagramResponse = Http::get("https://graph.facebook.com/v21.0/{$instagramId}", [
                'access_token' => $page['access_token'] ?? $accessToken,
                'fields' => 'id,username,name,profile_picture_url',
            ]);

            if ($instagramResponse->failed()) {
                logger()->warning('Failed to get Instagram account details', [
                    'instagram_id' => $instagramId,
                    'error' => $instagramResponse->json()['error']['message'] ?? 'Unknown error',
                ]);

                return;
            }

            $instagramAccount = $instagramResponse->json();

            auth()->user()->currentTeam->channels()->updateOrCreate([
                'platform_id' => $instagramAccount['id'],
            ], [
                'user_id' => auth()->id(),
                'platform' => ChannelPlatform::Instagram,
                'type' => ChannelType::Account,
                'name' => $instagramAccount['username'] ?? $instagramAccount['name'] ?? 'Instagram Account',
                'access_token' => $page['access_token'] ?? $accessToken,
            ]);
        });

        return true;
    }

    /**
     * @throws Exception
     */
    public function getTwitterAccount($user): bool
    {
        auth()->user()->currentTeam->channels()->updateOrCreate([
            'platform_id' => $user->id,
        ], [
            'user_id' => auth()->id(),
            'platform' => ChannelPlatform::Twitter,
            'type' => ChannelType::Account,
            'name' => $user->name,
            'access_token' => $user->token,
            'access_token_secret' => $user->tokenSecret,
        ]);

        return true;
    }
}
