<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Throwable;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StorePostRequest;

final class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $posts = auth()->user()->currentTeam->posts()->latest()->paginate();

        return inertia('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Display the calendar view for scheduling posts.
     */
    public function calendar(): Response
    {
        $posts = auth()->user()->currentTeam->posts()
            ->with('channels')
            ->whereNotNull('published_at')
            ->orderBy('published_at')
            ->get()
            ->map(fn ($post): array => [
                'id' => $post->id,
                'content' => $post->content,
                'published_at' => $post->published_at,
                'is_draft' => $post->is_draft,
                'post_type' => $post->post_type,
                'channels' => $post->channels->map(fn ($channel): array => [
                    'id' => $channel->id,
                    'name' => $channel->name,
                    'platform' => $channel->platform,
                ])->toArray(),
                'media' => $post->media,
            ]);

        $channels = auth()->user()->currentTeam->channels()->get()->map(fn ($channel): array => [
            'id' => $channel->id,
            'name' => $channel->name,
            'platform' => $channel->platform,
            'type' => $channel->type,
            'label' => $channel->title,
        ]);

        return inertia('Posts/Calendar', [
            'posts' => $posts,
            'channels' => $channels,
            'groupedChannels' => $channels->groupBy('platform'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $channels = auth()->user()->currentTeam->channels()->get()->map(fn ($channel): array => [
            'id' => $channel->id,
            'name' => $channel->name,
            'platform' => $channel->platform,
            'type' => $channel->type,
            'label' => $channel->title,
        ]);

        // Group channels by platform
        $groupedChannels = $channels->groupBy('platform');

        return inertia('Posts/Create', [
            'channels' => $channels,
            'groupedChannels' => $groupedChannels,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $media = [];
        if (is_array($request->media)) {
            foreach ($request->media as $index => $file) {
                $media[$index]['id'] = Str::uuid();
                $media[$index]['name'] = $file->getClientOriginalName();
                $media[$index]['filetype'] = $file->getClientOriginalExtension();
                $media[$index]['size'] = $file->getSize();
                $media[$index]['path'] = $file->store('media');
            }
        }

        DB::beginTransaction();

        $isDraft = $request->boolean('is_draft', false);
        $isScheduled = $request->boolean('is_scheduled', false);

        $channels = $validated['channels'];
        unset($validated['channels'], $validated['is_scheduled']);

        $post = auth()->user()->currentTeam->posts()->create([
            'user_id' => auth()->id(),
            ...$validated,
            'media' => $media,
            'published_at' => $isScheduled ? $validated['published_at'] : now(),
            'is_draft' => $isDraft,
            'review_status' => $isDraft ? 'pending' : 'pending', // All posts start as pending for review
        ]);

        $post->channels()->attach($channels);

        DB::commit();

        $message = $isDraft ? 'Draft saved successfully.' : 'Post created successfully.';

        return redirect()->route('posts.index')->banner($message);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePostRequest $request, string $id): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        //
    }
}
