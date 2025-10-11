# Trending Feature Documentation

## Overview
The Trending feature provides AI-powered analysis of viral posts, trending hashtags, and trending topics from various social media platforms. This helps the marketing team stay current with global trends and create engaging content.

## Features

### 1. Trending Topics
- Real-time trending topics from major platforms (Twitter, Instagram, Facebook, TikTok, LinkedIn)
- Engagement scores and growth rates
- Category-based filtering
- AI-powered sentiment analysis

### 2. Trending Hashtags
- Popular hashtags across platforms
- Usage statistics and engagement metrics
- Related topics suggestions
- Growth trend analysis

### 3. Viral Posts
- Viral content discovery from social platforms
- Virality scores based on engagement metrics
- Author information and platform details
- Content analysis and hashtag extraction

## Technical Implementation

### Database Models
- `TrendingTopic`: Stores trending topics with engagement metrics
- `TrendingHashtag`: Stores trending hashtags with usage statistics
- `ViralPost`: Stores viral posts with virality scores

### Scheduled Jobs
- `FetchTrendingDataJob`: Runs every 12 hours to fetch new trending data
- Uses AI services to analyze and score content
- Updates database with latest trending information

### API Endpoints
- `GET /trending`: Main trending page
- `GET /api/trending/topics`: Trending topics API
- `GET /api/trending/hashtags`: Trending hashtags API
- `GET /api/trending/viral-posts`: Viral posts API

### Frontend Components
- `Trending/Index.jsx`: Main trending page with tabs and filters
- `TrendingTopicCard.jsx`: Individual topic display component
- `TrendingHashtagCard.jsx`: Individual hashtag display component
- `ViralPostCard.jsx`: Individual viral post display component

## Setup Instructions

1. Run database migrations:
```bash
php artisan migrate
```

2. Seed the database with sample data:
```bash
php artisan db:seed
```

3. Manually trigger trending data fetch (optional):
```bash
php artisan trending:fetch
```

4. Access the trending page at `/trending` in your application

## Configuration

The trending data fetch job is automatically scheduled to run every 12 hours. You can modify the schedule in `routes/console.php`.

## Future Enhancements

1. **Real API Integration**: Replace mock data with actual platform APIs
2. **AI Content Analysis**: Integrate with AI services for better content analysis
3. **Custom Filters**: Add more advanced filtering options
4. **Export Functionality**: Allow users to export trending data
5. **Notifications**: Alert users when specific topics/hashtags trend
6. **Analytics Dashboard**: Detailed analytics for trending data

## Usage

1. Navigate to the Trending page from the sidebar
2. Use platform and category filters to narrow down results
3. Switch between Trending Now, Trending Hashtags, and Viral Posts tabs
4. Save interesting topics/hashtags for later use
5. Use the "Use in Post" button to create content based on trending data

The system automatically updates every 12 hours to ensure you always have the latest trending information.
