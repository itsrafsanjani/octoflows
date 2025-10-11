import { Link, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { Icon } from '@iconify/react'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Badge } from '@/Components/shadcn/ui/badge'
import AppLayout from '@/Layouts/AppLayout'

export default function PostView() {
  const { post } = usePage().props

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: 'lucide:facebook',
      twitter: 'lucide:twitter',
      instagram: 'lucide:instagram',
      linkedin: 'lucide:linkedin',
      youtube: 'lucide:youtube',
    }
    return icons[platform.toLowerCase()] || 'lucide:globe'
  }

  const getPostTypeColor = (postType) => {
    return postType === 'campaign' ? 'bg-red-500' : 'bg-orange-500'
  }

  const getPostTypeLabel = (post) => {
    if (post.post_type === 'campaign') {
      return 'Campaign Posts'
    }
    return 'Single Posts'
  }

  const getStatusBadge = (post) => {
    const isScheduled = post.published_at && new Date(post.published_at) > new Date()
    return isScheduled ? (
      <Badge variant="secondary">Scheduled</Badge>
    ) : (
      <Badge variant="default">Published</Badge>
    )
  }

  return (
    <AppLayout title={`View Post - ${post.content?.substring(0, 30)}...`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('posts.archive')}>
                <Icon icon="lucide:arrow-left" className="h-4 w-4 mr-2" />
                Back to Archive
              </Link>
            </Button>
            <Icon icon="lucide:eye" className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">View Post</h1>
              <p className="text-muted-foreground">Post details and information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    className={`${getPostTypeColor(post.post_type)} text-white`}
                  >
                    {getPostTypeLabel(post)}
                  </Badge>
                  {getStatusBadge(post)}
                </div>
                <CardTitle className="text-lg">
                  {post.content?.substring(0, 60)}
                  {post.content?.length > 60 && '...'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
                
                {post.media && post.media.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Media Files</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {post.media.map((media, index) => (
                        <div key={index} className="border rounded p-2">
                          <div className="text-sm font-medium">{media.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {media.filetype?.toUpperCase()} • {Math.round(media.size / 1024)} KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Configurations */}
            {post.platform_configs && Object.keys(post.platform_configs).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configurations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(post.platform_configs).map(([platform, config]) => (
                      <div key={platform} className="border rounded p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon={getPlatformIcon(platform)} className="h-4 w-4" />
                          <span className="font-medium capitalize">{platform}</span>
                        </div>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(config, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Information */}
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Post Type</label>
                  <div className="text-sm capitalize">{post.post_type}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">AI Tone</label>
                  <div className="text-sm capitalize">{post.ai_tone || 'N/A'}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created By</label>
                  <div className="text-sm">{post.user?.name || 'Unknown'}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Published At</label>
                  <div className="text-sm">
                    {post.published_at ? (
                      format(new Date(post.published_at), 'MMM dd, yyyy \'at\' h:mm a')
                    ) : (
                      'Not published'
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <div className="text-sm">
                    {format(new Date(post.created_at), 'MMM dd, yyyy \'at\' h:mm a')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader>
                <CardTitle>Published Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                {post.channels && post.channels.length > 0 ? (
                  <div className="space-y-2">
                    {post.channels.map((channel) => (
                      <div key={channel.id} className="flex items-center gap-2 p-2 border rounded">
                        <Icon icon={getPlatformIcon(channel.platform)} className="h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium">{channel.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {channel.platform} • {channel.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No platforms configured</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={route('posts.archive')}>
                    <Icon icon="lucide:arrow-left" className="h-4 w-4 mr-2" />
                    Back to Archive
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={route('posts.edit', post.id)}>
                    <Icon icon="lucide:edit" className="h-4 w-4 mr-2" />
                    Edit Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
