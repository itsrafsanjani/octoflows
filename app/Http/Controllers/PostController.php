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
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $channels = auth()->user()->currentTeam->channels()->get()->map(function ($channel) {
            return [
                'value' => $channel->id,
                'label' => $channel->title,
            ];
        });

        return inertia('Posts/Create', [
            'channels' => $channels,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
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

        $post = auth()->user()->currentTeam->posts()->create([
            'user_id' => auth()->id(),
            'content' => $request->input('content'),
            'media' => $media,
            'published_at' => $request->input('is_scheduled') ? $request->input('published_at') : now(),
        ]);

        $post->channels()->attach($request->input('channels'));

        DB::commit();

        return redirect()->route('posts.index')->banner('Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePostRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
