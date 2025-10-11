import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/shadcn/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/shadcn/ui/select'
import { Icon } from '@iconify/react'
import { router } from '@inertiajs/react'
import EngagementChart from '@/Components/Analytics/EngagementChart'

// KPI Card Component
function KPICard({ title, value, change, trend, icon, color }) {
  const formatValue = (val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`
    }
    return val.toString()
  }

  const formatChange = (change) => {
    const sign = change > 0 ? '+' : ''
    return `${sign}${change}%`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon icon={icon} className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon 
            icon={trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'} 
            className={`h-3 w-3 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} 
          />
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {formatChange(change)}
          </span>
          <span>from last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact Platform Performance Item Component
function PlatformPerformanceItem({ platform, impressions, change, icon, color }) {
  const formatValue = (val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`
    }
    return val.toString()
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-3">
        <Icon icon={icon} className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">{platform}</div>
          <div className="text-xs text-muted-foreground">Impressions</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm">{formatValue(impressions)}</div>
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <Icon icon="lucide:trending-up" className="h-3 w-3" />
          <span>+{change}%</span>
        </div>
      </div>
    </div>
  )
}

// Best Performing Content Card Component
function BestPerformingCard({ title, description, value, icon, color }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon icon={icon} className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-medium mb-1">{description}</div>
        <div className="text-2xl font-medium">{value}</div>
      </CardContent>
    </Card>
  )
}


// Post Performance Table Component
function PostPerformanceTable({ data, filters, onFilterChange }) {
  const [localPlatform, setLocalPlatform] = useState(filters.platform);

  const handlePlatformChange = (value) => {
    setLocalPlatform(value);
    // Filter data locally without page refresh
    onFilterChange('platform', value, false);
  };

  // Filter posts locally based on selected platform
  const filteredPosts = data.data?.filter(post => {
    if (localPlatform === 'all') return true;
    return post.platform.toLowerCase() === localPlatform.toLowerCase();
  }) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Post Performance</CardTitle>
            <CardDescription>Detailed performance metrics for your posts</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={localPlatform} onValueChange={handlePlatformChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="pinterest">Pinterest</SelectItem>
                <SelectItem value="snapchat">Snapchat</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="twitch">Twitch</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Icon icon="lucide:download" className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Post Title</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Platform</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Impressions</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Engagement</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Clicks</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-4 align-middle">{post.title}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.platform_color}`}>
                      {post.platform}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{post.date}</td>
                  <td className="p-4 align-middle">{post.impressions?.toLocaleString() || 0}</td>
                  <td className="p-4 align-middle">{post.engagement?.toLocaleString() || 0}</td>
                  <td className="p-4 align-middle">{post.clicks?.toLocaleString() || 0}</td>
                  <td className="p-4 align-middle">
                    <span className="text-green-600 font-medium">{post.rate ? post.rate.toFixed(1) : '0.0'}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsIndex({ 
  kpis, 
  engagementOverTime, 
  platformPerformance, 
  postPerformance, 
  bestPerformingContent,
  dateRange,
  granularity 
}) {
  const [filters, setFilters] = useState({
    platform: 'all',
    sortBy: 'date'
  })

  const handleFilterChange = (key, value, shouldRefresh = true) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    
    // Only trigger Inertia request if shouldRefresh is true
    if (shouldRefresh) {
      router.get(route('analytics.index'), {
        ...filters,
        [key]: value,
        date_range: dateRange,
        granularity: granularity
      }, {
        preserveState: true,
        replace: true
      })
    }
  }

  const handleDateRangeChange = (range) => {
    router.get(route('analytics.index'), {
      ...filters,
      date_range: range,
      granularity: granularity
    }, {
      preserveState: true,
      replace: true
    })
  }

  const handleGranularityChange = (gran) => {
    router.get(route('analytics.index'), {
      ...filters,
      date_range: dateRange,
      granularity: gran
    }, {
      preserveState: true,
      replace: true
    })
  }

  return (
    <AppLayout title="Analytics Dashboard">
      <Head title="Analytics Dashboard" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your social media performance and insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button>Apply</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Impressions"
            value={kpis.totalImpressions.value}
            change={kpis.totalImpressions.change}
            trend={kpis.totalImpressions.trend}
            icon="lucide:eye"
            color="text-blue-600"
          />
          <KPICard
            title="Engagement Rate"
            value={kpis.engagementRate.value}
            change={kpis.engagementRate.change}
            trend={kpis.engagementRate.trend}
            icon="lucide:heart"
            color="text-green-600"
          />
          <KPICard
            title="Total Clicks"
            value={kpis.totalClicks.value}
            change={kpis.totalClicks.change}
            trend={kpis.totalClicks.trend}
            icon="lucide:mouse-pointer-click"
            color="text-orange-600"
          />
          <KPICard
            title="New Followers"
            value={kpis.newFollowers.value}
            change={kpis.newFollowers.change}
            trend={kpis.newFollowers.trend}
            icon="lucide:users"
            color="text-purple-600"
          />
        </div>

        {/* Engagement Chart */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Engagement Over Time</CardTitle>
                  <CardDescription>Track your social media engagement trends</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={granularity === 'day' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleGranularityChange('day')}
                  >
                    Day
                  </Button>
                  <Button 
                    variant={granularity === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleGranularityChange('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={granularity === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleGranularityChange('month')}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EngagementChart data={engagementOverTime} />
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Performance metrics by platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {platformPerformance.map((platform) => (
                <PlatformPerformanceItem
                  key={platform.platform}
                  platform={platform.platform}
                  impressions={platform.impressions}
                  change={platform.change}
                  icon={platform.icon}
                  color={platform.color}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Post Performance Table */}
        <PostPerformanceTable 
          data={postPerformance} 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        {/* Best Performing Content */}
        <div className="grid gap-4 md:grid-cols-3">
          <BestPerformingCard
            title="Highest Engagement"
            description={bestPerformingContent.highestEngagement.title}
            value={`${bestPerformingContent.highestEngagement.value.toLocaleString()} interactions • ${(bestPerformingContent.highestEngagement.rate || 0).toFixed(1)}% rate`}
            icon="lucide:heart"
            color="text-green-600"
          />
          <BestPerformingCard
            title="Most Impressions"
            description={bestPerformingContent.mostImpressions.title}
            value={`${bestPerformingContent.mostImpressions.value.toLocaleString()} impressions`}
            icon="lucide:eye"
            color="text-yellow-600"
          />
          <BestPerformingCard
            title="Most Clicks"
            description={bestPerformingContent.mostClicks.title}
            value={`${bestPerformingContent.mostClicks.value.toLocaleString()} clicks`}
            icon="lucide:mouse-pointer-click"
            color="text-blue-600"
          />
        </div>
      </div>
    </AppLayout>
  )
}
