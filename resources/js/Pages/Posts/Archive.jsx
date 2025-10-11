import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { Icon } from '@iconify/react'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/Components/shadcn/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/shadcn/ui/select'
import { Input } from '@/Components/shadcn/ui/input'
import { Badge } from '@/Components/shadcn/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/Components/shadcn/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/shadcn/ui/dropdown-menu'
import AppLayout from '@/Layouts/AppLayout'

export default function PostArchive() {
  const { posts, filters, statistics } = usePage().props
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '' && v !== 'all')
    )
    
    router.get(route('posts.archive'), cleanFilters, {
      preserveState: true,
      replace: true,
    })
  }

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

  const handleAction = (action, postId) => {
    if (action === 'requeue') {
      router.post(route('posts.requeue', postId))
    } else if (action === 'repost') {
      router.post(route('posts.repost', postId))
    } else if (action === 'view') {
      router.get(route('posts.view', postId))
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this post?')) {
        router.delete(route('posts.archive.destroy', postId))
      }
    }
  }

  const handleClearArchive = () => {
    if (confirm('Are you sure you want to clear the entire archive? This action cannot be undone.')) {
      router.delete(route('posts.archive.clear'))
    }
  }

  const handleExport = () => {
    window.open(route('posts.archive.export'), '_blank')
  }

  return (
    <AppLayout title="Post Archive">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Icon icon="lucide:archive" className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Post Archive</h1>
            <p className="text-muted-foreground">View and manage all your published posts</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex gap-4">
                  <Select
                    value={localFilters.type}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="single">Single Posts</SelectItem>
                      <SelectItem value="campaign">Campaign Posts</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={localFilters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">
                  <Input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={localFilters.date_from || ''}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    className="w-[140px]"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={localFilters.date_to || ''}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    className="w-[140px]"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExport}>
                  <Icon icon="lucide:download" className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="destructive" onClick={handleClearArchive}>
                  Clear Archive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statistics.total}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statistics.single_posts}</div>
              <div className="text-sm text-muted-foreground">Single Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statistics.campaign_posts}</div>
              <div className="text-sm text-muted-foreground">Campaign Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statistics.this_month}</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Archived Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Archived Posts</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {posts.data.length} of {posts.total} posts
                </span>
                <Button variant="outline" size="sm">
                  List View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {posts.data.length === 0 ? (
              <div className="text-center py-12">
                <Icon icon="lucide:archive" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No archived posts found</h3>
                <p className="text-muted-foreground mb-4">
                  Your published and scheduled posts will appear here.
                </p>
                <Button asChild>
                  <Link href={route('posts.create')}>Create Your First Post</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {posts.data.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${getPostTypeColor(post.post_type)} text-white`}
                          >
                            {getPostTypeLabel(post)}
                          </Badge>
                          {getStatusBadge(post)}
                        </div>

                        <div>
                          <h3 className="font-medium text-lg mb-1">
                            {post.content?.substring(0, 50)}
                            {post.content?.length > 50 && '...'}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {post.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {post.channels?.map((channel) => (
                              <Icon
                                key={channel.id}
                                icon={getPlatformIcon(channel.platform)}
                                className="h-4 w-4"
                              />
                            ))}
                          </div>
                          <span>
                            {post.published_at && (
                              <>
                                {new Date(post.published_at) > new Date() ? 'Scheduled' : 'Published'}:{' '}
                                {format(new Date(post.published_at), 'MMM dd, yyyy \'at\' h:mm a')}
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction('requeue', post.id)}
                        >
                          Requeue
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAction('repost', post.id)}
                        >
                          Repost
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAction('view', post.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction('delete', post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {posts.links && posts.links.length > 3 && (
          <Pagination>
            <PaginationContent>
              {posts.links.map((link, index) => (
                <PaginationItem key={index}>
                  {link.url ? (
                    index === 0 ? (
                      <PaginationPrevious href={link.url} />
                    ) : index === posts.links.length - 1 ? (
                      <PaginationNext href={link.url} />
                    ) : (
                      <PaginationLink href={link.url} isActive={link.active}>
                        {link.label}
                      </PaginationLink>
                    )
                  ) : null}
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AppLayout>
  )
}