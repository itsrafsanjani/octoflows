import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { Badge } from '@/Components/shadcn/ui/badge'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/shadcn/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/shadcn/ui/dialog'
import { Textarea } from '@/Components/shadcn/ui/textarea'
import { Label } from '@/Components/shadcn/ui/label'
import AppLayout from '@/Layouts/AppLayout'
import { Icon } from '@iconify/react'

export default function ReviewQueueIndex() {
  const { posts, stats, teamMembers, platforms, filters } = usePage().props
  const [reviewNotes, setReviewNotes] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)

  const handleFilterChange = (key, value) => {
    router.get(route('review-queue.index'), {
      ...filters,
      [key]: value || undefined,
    }, {
      preserveState: true,
      replace: true,
    })
  }

  const handleApprove = (post) => {
    router.post(route('posts.approve', post.id), {
      review_notes: reviewNotes,
    }, {
      onSuccess: () => {
        setIsApprovalDialogOpen(false)
        setReviewNotes('')
        setSelectedPost(null)
      },
    })
  }

  const handleReject = (post) => {
    router.post(route('posts.reject', post.id), {
      review_notes: reviewNotes,
    }, {
      onSuccess: () => {
        setIsRejectionDialogOpen(false)
        setReviewNotes('')
        setSelectedPost(null)
      },
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Icon icon='lucide:clock' className='h-4 w-4 text-muted-foreground' />
      case 'approved':
        return <Icon icon='lucide:check-circle' className='h-4 w-4 text-primary' />
      case 'rejected':
        return <Icon icon='lucide:x-circle' className='h-4 w-4 text-muted-foreground' />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant='outline'>Pending</Badge>
      case 'approved':
        return <Badge variant='outline' className='text-primary border-primary'>Approved</Badge>
      case 'rejected':
        return <Badge variant='outline'>Rejected</Badge>
      default:
        return null
    }
  }

  const getPlatformBadge = (platform) => {
    return (
      <Badge variant='outline' className='text-muted-foreground'>
        {platform}
      </Badge>
    )
  }

  const getReviewFlagIcon = (flags) => {
    if (!flags || flags.length === 0) return null
    
    return (
      <div className='flex items-center gap-1 text-muted-foreground'>
        <Icon icon='lucide:alert-triangle' className='h-4 w-4' />
        <span className='text-sm font-medium'>{flags.length} flag{flags.length > 1 ? 's' : ''}</span>
      </div>
    )
  }

  return (
    <AppLayout title='Review Queue'>
      <Head title='Review Queue' />
      
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Review Queue</h1>
            <p className='text-muted-foreground'>Review and approve posts before they go live</p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='outline'>
              <Icon icon='lucide:flag' className='h-3 w-3 mr-1' />
              {stats?.pending || 0} Pending
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className='flex gap-4'>
          <div className='flex-1'>
            <Label htmlFor='status-filter'>Status</Label>
            <Select value={filters.status || 'pending'} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className='flex-1'>
            <Label htmlFor='platform-filter'>Platform</Label>
            <Select value={filters.platform || 'all'} onValueChange={(value) => handleFilterChange('platform', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder='All Platforms' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className='flex-1'>
            <Label htmlFor='author-filter'>Author</Label>
            <Select value={filters.author || 'all'} onValueChange={(value) => handleFilterChange('author', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder='All Authors' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Authors</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts List */}
        <div className='space-y-4'>
          {posts.data.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <Icon icon='lucide:inbox' className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-semibold'>No posts found</h3>
                <p className='text-muted-foreground text-center'>
                  {filters.status === 'pending' 
                    ? 'No posts are pending review at the moment.'
                    : 'No posts match the current filters.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.data.map((post) => (
              <Card key={post.id} className='hover:shadow-md transition-shadow'>
                <CardContent className='p-6'>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Post Content */}
                    <div className='space-y-4'>
                      <div>
                        <h4 className='font-medium text-sm text-muted-foreground mb-2'>Post Content</h4>
                        <blockquote className='border-l-4 border-primary/20 pl-4 italic text-sm'>
                          "{post.content}"
                        </blockquote>
                      </div>
                      {post.media && post.media.length > 0 && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <Icon icon='lucide:image' className='h-4 w-4' />
                          <span>Post image</span>
                        </div>
                      )}
                    </div>

                    {/* Review Details */}
                    <div className='space-y-3 flex flex-col items-center justify-center'>
                      <div className='flex items-center gap-2'>
                        {getStatusIcon(post.review_status)}
                        <span className='text-sm font-medium'>
                          {post.review_status === 'pending' && 'Pending approval'}
                          {post.review_status === 'approved' && 'Approved'}
                          {post.review_status === 'rejected' && 'Rejected'}
                        </span>
                      </div>
                      
                      {getReviewFlagIcon(post.review_flags)}
                      
                      <div className='text-sm space-y-1 text-center'>
                        <p><span className='font-medium'>Created by:</span> {post.user.name}</p>
                        <p>
                          <span className='font-medium'>
                            {post.review_status === 'pending' ? 'Submitted:' : 'Reviewed:'}
                          </span>{' '}
                          {format(new Date(post.review_status === 'pending' ? post.created_at : post.reviewed_at), 'MMM d, yyyy')}
                        </p>
                        <div className='flex items-center justify-center gap-2'>
                          <span className='font-medium'>Platform:</span>
                          {post.channels.map((channel) => (
                            <span key={channel.id}>
                              {getPlatformBadge(channel.platform)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-2'>
                      <div className='flex gap-2'>
                        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant='default'
                              size='sm'
                              onClick={() => setSelectedPost(post)}
                            >
                              <Icon icon='lucide:check' className='h-4 w-4 mr-1' />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Post</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to approve this post? You can add optional review notes below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                              <div>
                                <Label htmlFor='approval-notes'>Review Notes (Optional)</Label>
                                <Textarea
                                  id='approval-notes'
                                  placeholder='Add any notes about this approval...'
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant='outline'
                                onClick={() => setIsApprovalDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleApprove(selectedPost)}
                              >
                                Approve Post
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={() => setSelectedPost(post)}
                            >
                              <Icon icon='lucide:x' className='h-4 w-4 mr-1' />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Post</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this post. This feedback will help the author improve.
                              </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                              <div>
                                <Label htmlFor='rejection-notes'>Rejection Reason *</Label>
                                <Textarea
                                  id='rejection-notes'
                                  placeholder='Please explain why this post is being rejected...'
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant='outline'
                                onClick={() => setIsRejectionDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant='destructive'
                                onClick={() => handleReject(selectedPost)}
                                disabled={!reviewNotes.trim()}
                              >
                                Reject Post
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button asChild variant='outline' size='sm'>
                          <Link href={route('posts.edit', post.id)}>
                            <Icon icon='lucide:edit' className='h-4 w-4 mr-1' />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icon icon='lucide:bar-chart-3' className='h-5 w-5' />
              Review Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-muted-foreground'>{stats?.pending || 0}</div>
                <div className='text-sm text-muted-foreground'>Pending</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-primary'>{stats?.approved || 0}</div>
                <div className='text-sm text-muted-foreground'>Approved</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-muted-foreground'>{stats?.rejected || 0}</div>
                <div className='text-sm text-muted-foreground'>Rejected</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-muted-foreground'>2.5h</div>
                <div className='text-sm text-muted-foreground'>Avg Review Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
