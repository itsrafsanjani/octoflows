<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Exception;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
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
            'facebook' => Socialite::driver($provider)->redirect(),
            'twitter' => Socialite::driver($provider)->redirect(),
            'linkedin' => Socialite::driver($provider)->redirect(),
            default => throw new Exception('Invalid provider.'),
        };
    }

    /**
     * @throws Exception
     */
    public function callback($provider)
    {
        $user = Socialite::driver($provider)->user();

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
    }

    /**
     * @throws Exception
     */
    public function getFacebookPages($accessToken)
    {
        $response = Http::get('https://graph.facebook.com/me/accounts', [
            'access_token' => $accessToken,
        ]);

        logger($response->json());

        if ($response->failed()) {
            throw new Exception($response->json()['error']['message'] ?? 'Failed to get Facebook pages.');
        }

        $pages = collect($response->json()['data']);

        $pages->each(function ($page) {
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
    public function getFacebookGroups($accessToken)
    {
        $response = Http::get('https://graph.facebook.com/me/groups', [
            'access_token' => $accessToken,
        ]);

        if ($response->failed()) {
            throw new Exception($response->json()['error']['message'] ?? 'Failed to get Facebook groups.');
        }

        $groups = collect($response->json()['data']);

        $groups->each(function ($group) use ($accessToken) {
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
    public function getInstagramAccounts($accessToken)
    {
        $response = Http::get('https://graph.facebook.com/me/accounts', [
            'access_token' => $accessToken,
        ]);

        if ($response->failed()) {
            throw new Exception($response->json()['error']['message'] ?? 'Failed to get Facebook pages which needs to get Instagram accounts.');
        }

        $pages = collect($response->json()['data']);

        $pages->each(function ($page) use ($accessToken) {
            $fbPageInstagramAccountResponse = Http::get("https://graph.facebook.com/{$page['id']}", [
                'access_token' => $accessToken,
                'fields' => 'instagram_business_account',
            ]);

            if ($fbPageInstagramAccountResponse->failed()) {
                throw new Exception($fbPageInstagramAccountResponse->json()['error']['message'] ?? 'Failed to get Instagram account.');
            }

            $instagramId = $fbPageInstagramAccountResponse->json()['instagram_business_account']['id'] ?? null;

            if (! $instagramId) {
                return;
            }

            $instagramResponse = Http::get("https://graph.facebook.com/$instagramId", [
                'access_token' => $accessToken,
                'fields' => 'username',
            ]);

            if ($instagramResponse->failed()) {
                throw new Exception($instagramResponse->json()['error']['message'] ?? 'Failed to get Instagram account details.');
            }

            $instagramAccount = $instagramResponse->json();

            auth()->user()->currentTeam->channels()->updateOrCreate([
                'platform_id' => $instagramAccount['id'],
            ], [
                'user_id' => auth()->id(),
                'platform' => ChannelPlatform::Instagram,
                'type' => ChannelType::Account,
                'name' => $instagramAccount['username'],
                'access_token' => $page['access_token'],
            ]);
        });

        return true;
    }

    /**
     * @throws Exception
     */
    public function getTwitterAccount($user)
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
