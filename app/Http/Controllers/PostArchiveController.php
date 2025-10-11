<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

final class PostArchiveController extends Controller
{
    /**
     * Display the post archive page with filtering and pagination.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $team = $user->currentTeam;

        if (! $team) {
            abort(403, 'No team found for user');
        }

        $query = $team->posts()
            ->with(['channels', 'user'])
            ->where('is_draft', false)
            ->latest('published_at');

        // Apply filters
        $postType = $request->get('type', 'all');
        $status = $request->get('status', 'all');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        if ($postType !== 'all') {
            $query->where('post_type', $postType);
        }

        if ($status !== 'all') {
            if ($status === 'published') {
                $query->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
            } elseif ($status === 'scheduled') {
                $query->whereNotNull('published_at')
                    ->where('published_at', '>', now());
            }
        }

        if ($dateFrom) {
            $query->whereDate('published_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('published_at', '<=', $dateTo);
        }

        $posts = $query->paginate(10)->withQueryString();

        // Calculate statistics
        $totalPosts = $team->posts()->where('is_draft', false)->count();
        $singlePosts = $team->posts()->where('is_draft', false)->where('post_type', 'single')->count();
        $campaignPosts = $team->posts()->where('is_draft', false)->where('post_type', 'campaign')->count();
        $thisMonthPosts = $team->posts()
            ->where('is_draft', false)
            ->whereMonth('published_at', now()->month)
            ->whereYear('published_at', now()->year)
            ->count();

        return Inertia::render('Posts/Archive', [
            'posts' => $posts,
            'filters' => [
                'type' => $postType,
                'status' => $status,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'statistics' => [
                'total' => $totalPosts,
                'single_posts' => $singlePosts,
                'campaign_posts' => $campaignPosts,
                'this_month' => $thisMonthPosts,
            ],
        ]);
    }

    /**
     * Requeue a post (move it back to draft status with optional new schedule).
     */
    public function requeue(Request $request, string $id): RedirectResponse
    {
        $post = Auth::user()->currentTeam->posts()->findOrFail($id);

        $validated = $request->validate([
            'published_at' => ['nullable', 'date', 'after:now'],
        ]);

        $updateData = ['is_draft' => true];

        if (isset($validated['published_at'])) {
            $updateData['published_at'] = $validated['published_at'];
        }

        $post->update($updateData);

        return redirect()->back()->banner('Post requeued and scheduled successfully.');
    }

    /**
     * Repost a post (create a new post with the same content).
     */
    public function repost(string $id): RedirectResponse
    {
        $originalPost = Auth::user()->currentTeam->posts()->findOrFail($id);

        $newPost = Auth::user()->currentTeam->posts()->create([
            'user_id' => Auth::id(),
            'post_type' => $originalPost->post_type,
            'ai_tone' => $originalPost->ai_tone,
            'content' => $originalPost->content,
            'media' => $originalPost->media,
            'platform_configs' => $originalPost->platform_configs,
            'published_at' => now(),
            'is_draft' => false,
            'is_picked_by_job' => false,
        ]);

        // Copy channel associations
        $newPost->channels()->attach($originalPost->channels->pluck('id'));

        return redirect()->back()->banner('Post reposted successfully.');
    }

    /**
     * View a specific archived post.
     */
    public function view(string $id): Response
    {
        $post = Auth::user()->currentTeam->posts()
            ->with(['channels', 'user'])
            ->findOrFail($id);

        return Inertia::render('Posts/View', [
            'post' => $post,
        ]);
    }

    /**
     * Delete a post from the archive.
     */
    public function destroy(string $id): RedirectResponse
    {
        $post = Auth::user()->currentTeam->posts()->findOrFail($id);
        $post->delete();

        return redirect()->back()->banner('Post deleted successfully.');
    }

    /**
     * Clear the entire archive (delete all published posts).
     */
    public function clearArchive(): RedirectResponse
    {
        Auth::user()->currentTeam->posts()
            ->where('is_draft', false)
            ->delete();

        return redirect()->back()->banner('Archive cleared successfully.');
    }

    /**
     * Export archive data.
     */
    public function export(Request $request): \Illuminate\Http\Response
    {
        $user = Auth::user();
        $team = $user->currentTeam;

        $posts = $team->posts()
            ->with(['channels', 'user'])
            ->where('is_draft', false)
            ->latest('published_at')
            ->get();

        $csvData = "Post Type,Content,Platforms,Published At,Status\n";

        foreach ($posts as $post) {
            $platforms = $post->channels->pluck('platform')->join(', ');
            $status = $post->published_at > now() ? 'Scheduled' : 'Published';

            $csvData .= sprintf(
                "%s,\"%s\",%s,%s,%s\n",
                $post->post_type,
                str_replace('"', '""', $post->content),
                $platforms,
                $post->published_at?->format('Y-m-d H:i:s') ?? 'N/A',
                $status
            );
        }

        $filename = 'post_archive_'.now()->format('Y-m-d_H-i-s').'.csv';

        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }
}
