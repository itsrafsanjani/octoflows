# Review Queue Feature

The Review Queue feature allows team administrators to review and approve posts before they go live on social media platforms.

## Features

- **Review Posts**: Team members can submit posts for review, which appear in the Review Queue
- **Approve/Reject**: Administrators can approve or reject posts with optional review notes
- **Filtering**: Filter posts by status (pending, approved, rejected), platform, or author
- **Statistics**: View review statistics including pending, approved, and rejected post counts
- **Review Flags**: Posts can have review flags indicating potential issues (e.g., "Suspicious link detected")

## How to Use

### For Team Members (Post Creators)
1. Create a post using the "Create Post" feature
2. Posts are automatically set to "pending" status for review
3. Wait for administrator approval before the post goes live

### For Administrators (Reviewers)
1. Navigate to "Review Queue" in the sidebar
2. View all pending posts that need review
3. Use filters to narrow down posts by status, platform, or author
4. Review each post and either:
   - **Approve**: Click "Approve" button (optional review notes)
   - **Reject**: Click "Reject" button (required review notes explaining rejection reason)
   - **Edit**: Click "Edit" to modify the post before approval

## Database Schema

The following fields were added to the `posts` table:

- `review_status`: Enum ('pending', 'approved', 'rejected') - default 'pending'
- `reviewed_by`: Foreign key to users table - who reviewed the post
- `reviewed_at`: Timestamp when the review was completed
- `review_notes`: Text field for review comments/notes
- `review_flags`: JSON array for storing review flags/warnings

## API Endpoints

- `GET /review-queue` - Display the review queue page
- `POST /posts/{post}/approve` - Approve a post
- `POST /posts/{post}/reject` - Reject a post
- `PATCH /posts/{post}/flags` - Update review flags for a post

## Testing

The feature includes comprehensive tests covering:
- Page display and data loading
- Post filtering by status, platform, and author
- Post approval and rejection workflows
- Review statistics calculation
- Validation rules for required fields

Run tests with:
```bash
php artisan test --filter=ReviewQueueTest
```

## Sample Data

Sample data can be created using the provided seeders:
```bash
php artisan db:seed --class=ChannelSeeder
php artisan db:seed --class=ReviewQueueSeeder
```
