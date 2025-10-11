import { Card, CardContent, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Badge } from '@/Components/shadcn/ui/badge'
import { Button } from '@/Components/shadcn/ui/button'
import { Icon } from '@iconify/react'
import { formatDistanceToNow } from 'date-fns'

export default function TrendingHashtagCard({ hashtag, onSave, onUseInPost }) {
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
    <Card className="hover:shadow-md transition-shadow">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onSave?.(hashtag)}
          >
            <Icon icon="lucide:bookmark" className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onUseInPost?.(hashtag)}
          >
            <Icon icon="lucide:pencil" className="h-4 w-4 mr-1" />
            Use in Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
