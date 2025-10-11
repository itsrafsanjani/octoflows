<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;

final class ReviewQueueController extends Controller
{
    /**
     * Display the review queue page.
     */
    public function index(Request $request): Response
    {
        $query = auth()->user()->currentTeam->posts()
            ->with(['user', 'reviewer', 'channels'])
            ->where('is_draft', false);

        // Filter by review status
        if ($request->filled('status')) {
            $query->where('review_status', $request->status);
        } else {
            // Default to pending posts
            $query->where('review_status', 'pending');
        }

        // Filter by platform
        if ($request->filled('platform')) {
            $query->whereHas('channels', function ($q) use ($request) {
                $q->where('platform', $request->platform);
            });
        }

        // Filter by author
        if ($request->filled('author')) {
            $query->where('user_id', $request->author);
        }

        $posts = $query->latest()->paginate(10);

        // Get statistics
        $stats = auth()->user()->currentTeam->posts()
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN review_status = "pending" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN review_status = "approved" THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN review_status = "rejected" THEN 1 ELSE 0 END) as rejected
            ')
            ->where('is_draft', false)
            ->first();

        // Get team members for filter
        $teamMembers = auth()->user()->currentTeam->allUsers()->map(fn ($user): array => [
            'id' => $user->id,
            'name' => $user->name,
        ]);

        // Get platforms for filter
        $platforms = auth()->user()->currentTeam->channels()
            ->select('platform')
            ->distinct()
            ->pluck('platform');

        return inertia('ReviewQueue/Index', [
            'posts' => $posts,
            'stats' => $stats,
            'teamMembers' => $teamMembers,
            'platforms' => $platforms,
            'filters' => $request->only(['status', 'platform', 'author']),
        ]);
    }

    /**
     * Approve a post.
     */
    public function approve(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'review_notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($post, $request) {
            $post->update([
                'review_status' => 'approved',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'review_notes' => $request->review_notes,
            ]);
        });

        return redirect()->back()->banner('Post approved successfully.');
    }

    /**
     * Reject a post.
     */
    public function reject(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'review_notes' => 'required|string|max:1000',
        ]);

        DB::transaction(function () use ($post, $request) {
            $post->update([
                'review_status' => 'rejected',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'review_notes' => $request->review_notes,
            ]);
        });

        return redirect()->back()->banner('Post rejected successfully.');
    }

    /**
     * Update review flags for a post.
     */
    public function updateFlags(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'review_flags' => 'nullable|array',
            'review_flags.*' => 'string|max:255',
        ]);

        $post->update([
            'review_flags' => $request->review_flags ?? [],
        ]);

        return redirect()->back()->banner('Review flags updated successfully.');
    }
}
