import { Card, CardContent, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Badge } from '@/Components/shadcn/ui/badge'
import { Button } from '@/Components/shadcn/ui/button'
import { Icon } from '@iconify/react'
import { formatDistanceToNow } from 'date-fns'

export default function ViralPostCard({ post, onSave, onUseInPost }) {
  const getTrendScoreColor = (score) => {
    if (score >= 90) return 'text-red-500'
    if (score >= 80) return 'text-orange-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onSave?.(post)}
          >
            <Icon icon="lucide:bookmark" className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onUseInPost?.(post)}
          >
            <Icon icon="lucide:pencil" className="h-4 w-4 mr-1" />
            Use in Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
