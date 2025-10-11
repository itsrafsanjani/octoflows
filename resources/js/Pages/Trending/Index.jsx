import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Badge } from '@/Components/shadcn/ui/badge'
import { Button } from '@/Components/shadcn/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/shadcn/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/shadcn/ui/select'
import { Icon } from '@iconify/react'
import { formatDistanceToNow } from 'date-fns'

export default function TrendingIndex({ trendingTopics, trendingHashtags, viralPosts, platformStats, categoryStats, filters }) {
  const [selectedPlatform, setSelectedPlatform] = useState(filters.platform || 'all')
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all')
  const [activeTab, setActiveTab] = useState('trending')

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    ...categoryStats.map(stat => ({ value: stat.category, label: stat.category })),
  ]

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform)
    // In a real app, you would make an API call here to filter data
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    // In a real app, you would make an API call here to filter data
  }

  const getTrendScoreColor = (score) => {
    if (score >= 90) return 'text-red-500'
    if (score >= 80) return 'text-orange-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getGrowthRateColor = (rate) => {
    if (rate >= 300) return 'text-green-600'
    if (rate >= 200) return 'text-green-500'
    if (rate >= 100) return 'text-yellow-500'
    return 'text-gray-500'
  }

  return (
    <AppLayout title="Trending">
      <Head title="Trending" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending Tags & Forecasts</h1>
            <p className="text-muted-foreground">
              Discover what's trending and plan your content strategy
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:bar-chart-3" className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <Icon icon="lucide:flame" className="h-4 w-4" />
              Trending Now
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-2">
              <Icon icon="lucide:hash" className="h-4 w-4" />
              Trending Hashtags
            </TabsTrigger>
            <TabsTrigger value="viral" className="flex items-center gap-2">
              <Icon icon="lucide:zap" className="h-4 w-4" />
              Viral Posts
            </TabsTrigger>
          </TabsList>

          {/* Trending Topics Tab */}
          <TabsContent value="trending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trendingTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {topic.category || 'General'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:flame" className={`h-4 w-4 ${getTrendScoreColor(topic.engagement_score)}`} />
                        <span className={`text-sm font-medium ${getTrendScoreColor(topic.engagement_score)}`}>
                          {topic.engagement_score}/100
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:message-circle" className="h-4 w-4 text-muted-foreground" />
                        <span>{topic.mentions_count.toLocaleString()} mentions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:trending-up" className={`h-4 w-4 ${getGrowthRateColor(topic.growth_rate)}`} />
                        <span className={getGrowthRateColor(topic.growth_rate)}>
                          +{topic.growth_rate}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{topic.platform}</span>
                      <span>
                        {topic.trending_since ? formatDistanceToNow(new Date(topic.trending_since), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon icon="lucide:bookmark" className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Icon icon="lucide:pencil" className="h-4 w-4 mr-1" />
                        Use in Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Hashtags Tab */}
          <TabsContent value="hashtags" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trendingHashtags.map((hashtag) => (
                <Card key={hashtag.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {hashtag.platform}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:flame" className={`h-4 w-4 ${getTrendScoreColor(hashtag.engagement_score)}`} />
                        <span className={`text-sm font-medium ${getTrendScoreColor(hashtag.engagement_score)}`}>
                          {hashtag.engagement_score}/100
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-primary">
                      {hashtag.hashtag.startsWith('#') ? hashtag.hashtag : `#${hashtag.hashtag}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:hash" className="h-4 w-4 text-muted-foreground" />
                        <span>{hashtag.usage_count.toLocaleString()} uses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:trending-up" className={`h-4 w-4 ${getGrowthRateColor(hashtag.growth_rate)}`} />
                        <span className={getGrowthRateColor(hashtag.growth_rate)}>
                          +{hashtag.growth_rate}%
                        </span>
                      </div>
                    </div>

                    {hashtag.related_topics && hashtag.related_topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {hashtag.related_topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{hashtag.platform}</span>
                      <span>
                        {hashtag.trending_since ? formatDistanceToNow(new Date(hashtag.trending_since), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon icon="lucide:bookmark" className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Icon icon="lucide:pencil" className="h-4 w-4 mr-1" />
                        Use in Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Viral Posts Tab */}
          <TabsContent value="viral" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {viralPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {post.platform}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:zap" className={`h-4 w-4 ${getTrendScoreColor(post.virality_score)}`} />
                        <span className={`text-sm font-medium ${getTrendScoreColor(post.virality_score)}`}>
                          {post.virality_score}/100
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-normal">
                      @{post.author_username || 'Unknown'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.slice(0, 3).map((hashtag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Icon icon="lucide:heart" className="h-4 w-4 text-red-500" />
                          <span>{post.likes_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon icon="lucide:repeat-2" className="h-4 w-4 text-blue-500" />
                          <span>{post.shares_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon icon="lucide:message-circle" className="h-4 w-4 text-green-500" />
                          <span>{post.comments_count.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.platform}</span>
                      <span>
                        {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon icon="lucide:bookmark" className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Icon icon="lucide:pencil" className="h-4 w-4 mr-1" />
                        Use in Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Platform Statistics */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {platformStats.map((stat) => (
              <Card key={stat.platform}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{stat.platform}</p>
                      <p className="text-2xl font-bold">{stat.topics_count + stat.hashtags_count + stat.viral_posts_count}</p>
                    </div>
                    <Icon icon={`lucide:${stat.platform === 'twitter' ? 'twitter' : stat.platform === 'instagram' ? 'instagram' : stat.platform === 'facebook' ? 'facebook' : stat.platform === 'tiktok' ? 'music' : 'linkedin'}`} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {stat.topics_count} topics, {stat.hashtags_count} hashtags, {stat.viral_posts_count} viral posts
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
