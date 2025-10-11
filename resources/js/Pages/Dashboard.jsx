import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@iconify/react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/Components/shadcn/ui/badge'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import AppLayout from '@/Layouts/AppLayout'

export default function Dashboard() {
  const { stats, recentPosts, platformStats, upcomingScheduled, engagementData } = usePage().props

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <AppLayout title='Dashboard'>
      <Head title='Dashboard' />
      
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-muted-foreground'>Welcome back! Here's your social media overview</p>
          </div>
          <div className='flex items-center gap-2'>
            <Button asChild>
              <Link href={route('posts.create')}>
                <Icon icon='lucide:plus' className='h-4 w-4 mr-2' />
                Create Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Posts</CardTitle>
              <Icon icon='lucide:file-text' className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatNumber(stats.total_posts)}</div>
              <p className='text-xs text-muted-foreground'>
                <span className='text-green-600'>+{stats.weekly_growth}%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Engagement</CardTitle>
              <Icon icon='lucide:heart' className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatNumber(stats.total_engagement)}</div>
              <p className='text-xs text-muted-foreground'>
                Likes, comments, and shares
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Monthly Reach</CardTitle>
              <Icon icon='lucide:trending-up' className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatNumber(stats.monthly_reach)}</div>
              <p className='text-xs text-muted-foreground'>
                People reached this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending Review</CardTitle>
              <Icon icon='lucide:clock' className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.pending_review}</div>
              <p className='text-xs text-muted-foreground'>
                Posts awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Scheduled Posts</CardTitle>
              <Icon icon='lucide:calendar' className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.scheduled_posts}</div>
              <p className='text-xs text-muted-foreground'>
                Ready to publish
              </p>
            </CardContent>
          </Card>

          <Card className='bg-primary/5 border-primary/20'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Quick Actions</CardTitle>
              <Icon icon='lucide:zap' className='h-4 w-4 text-primary' />
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-2'>
                <Button asChild variant='outline' size='sm' className='w-full justify-start'>
                  <Link href={route('posts.create')}>
                    <Icon icon='lucide:plus' className='h-3 w-3 mr-2' />
                    New Post
                  </Link>
                </Button>
                <Button asChild variant='outline' size='sm' className='w-full justify-start'>
                  <Link href={route('review-queue.index')}>
                    <Icon icon='lucide:check-square' className='h-3 w-3 mr-2' />
                    Review Queue
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icon icon='lucide:bar-chart-3' className='h-5 w-5' />
              Platform Performance
            </CardTitle>
            <CardDescription>Your engagement across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {platformStats.map((platform) => (
                <div key={platform.platform} className='flex items-start gap-3 p-4 border rounded-lg'>
                  <div className='mt-1'>
                    <Icon icon={platform.icon} className='h-8 w-8' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-sm'>{platform.platform}</h4>
                    <div className='mt-2 space-y-1'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Followers</span>
                        <span className='font-medium'>{formatNumber(platform.followers)}</span>
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Engagement</span>
                        <span className='font-medium text-green-600'>{platform.engagement_rate}%</span>
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Today's Posts</span>
                        <span className='font-medium'>{platform.posts_today}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon icon='lucide:file-text' className='h-5 w-5' />
                Recent Posts
              </CardTitle>
              <CardDescription>Your latest published content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentPosts.map((post) => (
                  <div key={post.id} className='flex gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow'>
                    <div className='flex-1 space-y-2'>
                      <p className='text-sm line-clamp-2'>{post.content}</p>
                      <div className='flex items-center gap-2 flex-wrap'>
                        {post.platforms.map((platform) => (
                          <Badge key={platform} variant='outline' className='text-xs'>
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Icon icon='lucide:heart' className='h-3 w-3' />
                          <span>{formatNumber(post.engagement)}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Icon icon='lucide:eye' className='h-3 w-3' />
                          <span>{formatNumber(post.reach)}</span>
                        </div>
                        <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button asChild variant='outline' className='w-full'>
                  <Link href={route('posts.index')}>
                    View All Posts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Scheduled */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon icon='lucide:calendar-clock' className='h-5 w-5' />
                Upcoming Scheduled
              </CardTitle>
              <CardDescription>Posts ready to publish</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {upcomingScheduled.map((post) => (
                  <div key={post.id} className='flex gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow'>
                    <div className='flex-1 space-y-2'>
                      <p className='text-sm line-clamp-2'>{post.content}</p>
                      <div className='flex items-center gap-2 flex-wrap'>
                        {post.platforms.map((platform) => (
                          <Badge key={platform} variant='outline' className='text-xs'>
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <Icon icon='lucide:clock' className='h-3 w-3' />
                        <span>Scheduled {formatDistanceToNow(new Date(post.scheduled_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button asChild variant='outline' className='w-full'>
                  <Link href={route('posts.index')}>
                    View All Scheduled
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icon icon='lucide:activity' className='h-5 w-5' />
              Weekly Engagement
            </CardTitle>
            <CardDescription>Your engagement over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-end justify-between gap-2 h-48'>
              {engagementData.map((day, index) => {
                const maxEngagement = Math.max(...engagementData.map(d => d.engagement))
                const heightPercent = (day.engagement / maxEngagement) * 100
                
                return (
                  <div key={index} className='flex-1 flex flex-col items-center gap-2'>
                    <div 
                      className='w-full bg-primary rounded-t-md transition-all hover:bg-primary/80 relative group'
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className='absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap border shadow-sm'>
                        {formatNumber(day.engagement)}
                      </div>
                    </div>
                    <span className='text-xs text-muted-foreground font-medium'>{day.date}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
