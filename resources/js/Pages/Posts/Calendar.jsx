import { Icon } from "@iconify/react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    isToday,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    parseISO,
} from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/Components/lib/utils";
import { Badge } from "@/Components/shadcn/ui/badge";
import { Button } from "@/Components/shadcn/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/shadcn/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/shadcn/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/shadcn/ui/dropdown-menu";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { ScrollArea } from "@/Components/shadcn/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcn/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcn/ui/tabs";
import { Textarea } from "@/Components/shadcn/ui/textarea";
import AppLayout from "@/Layouts/AppLayout";

const PLATFORM_ICONS = {
    facebook: "mdi:facebook",
    twitter: "mdi:twitter",
    instagram: "mdi:instagram",
    linkedin: "mdi:linkedin",
    reddit: "mdi:reddit",
};

const PLATFORM_COLORS = {
    facebook: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    twitter: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    instagram: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    linkedin: "bg-blue-700/10 text-blue-700 border-blue-700/20",
    reddit: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function PostsCalendar() {
    const { posts, channels, groupedChannels } = usePage().props;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("month");
    const [selectedPost, setSelectedPost] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [quickCreateOpen, setQuickCreateOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [platformFilter, setPlatformFilter] = useState("all");

    const { data, setData, post, processing, errors, reset } = useForm({
        content: "",
        channels: [],
        published_at: "",
        is_draft: false,
        post_type: "text",
    });

    // Calendar calculations
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Filter and group posts by date
    const getPostsForDate = (date) => {
        return posts.filter((post) => {
            const postDate = parseISO(post.published_at);
            const matchesDate = isSameDay(postDate, date);

            if (platformFilter === "all") {
                return matchesDate;
            }

            return (
                matchesDate &&
                post.channels.some(
                    (channel) => channel.platform === platformFilter
                )
            );
        });
    };

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setDetailsOpen(true);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setData("published_at", format(date, "yyyy-MM-dd'T'HH:mm"));
        setQuickCreateOpen(true);
    };

    const handleQuickCreate = () => {
        if (data.channels.length === 0) {
            toast.error("Please select at least one channel");
            return;
        }

        post(route("posts.store"), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Post scheduled successfully!");
                setQuickCreateOpen(false);
                reset();
            },
            onError: () => {
                toast.error("Failed to schedule post");
            },
        });
    };

    const handleDeletePost = (postId) => {
        if (confirm("Are you sure you want to delete this post?")) {
            router.delete(route("posts.destroy", postId), {
                onSuccess: () => {
                    toast.success("Post deleted successfully");
                    setDetailsOpen(false);
                },
            });
        }
    };

    const handleDuplicatePost = (post) => {
        router.visit(route("posts.create"), {
            data: {
                content: post.content,
                channels: post.channels.map((ch) => ch.id),
                post_type: post.post_type,
            },
        });
    };

    const totalScheduled = posts.filter((p) => !p.is_draft).length;
    const totalDrafts = posts.filter((p) => p.is_draft).length;
    const upcomingThisWeek = posts.filter((p) => {
        const postDate = parseISO(p.published_at);
        const now = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(now.getDate() + 7);
        return postDate >= now && postDate <= weekFromNow && !p.is_draft;
    }).length;

    return (
        <AppLayout title="Content Calendar">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Content Calendar
                        </h2>
                        <p className="text-muted-foreground">
                            Visualize, schedule, and manage your social media
                            posts
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route("posts.index")}>
                                <Icon
                                    icon="lucide:list"
                                    className="mr-2 h-4 w-4"
                                />
                                List View
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route("posts.create")}>
                                <Icon
                                    icon="lucide:plus"
                                    className="mr-2 h-4 w-4"
                                />
                                Create Post
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Scheduled
                            </CardTitle>
                            <Icon
                                icon="lucide:calendar-check"
                                className="h-4 w-4 text-muted-foreground"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalScheduled}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Posts ready to publish
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming This Week
                            </CardTitle>
                            <Icon
                                icon="lucide:clock"
                                className="h-4 w-4 text-muted-foreground"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {upcomingThisWeek}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Posts in the next 7 days
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Drafts
                            </CardTitle>
                            <Icon
                                icon="lucide:file-edit"
                                className="h-4 w-4 text-muted-foreground"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalDrafts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Unpublished content
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar Controls */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePreviousMonth}
                                >
                                    <Icon
                                        icon="lucide:chevron-left"
                                        className="h-4 w-4"
                                    />
                                </Button>
                                <div className="min-w-[180px] text-center">
                                    <h3 className="text-xl font-semibold">
                                        {format(currentDate, "MMMM yyyy")}
                                    </h3>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextMonth}
                                >
                                    <Icon
                                        icon="lucide:chevron-right"
                                        className="h-4 w-4"
                                    />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleToday}
                                    className="ml-2"
                                >
                                    Today
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Select
                                    value={platformFilter}
                                    onValueChange={setPlatformFilter}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Platforms
                                        </SelectItem>
                                        <SelectItem value="facebook">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={
                                                        PLATFORM_ICONS.facebook
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                Facebook
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="twitter">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={
                                                        PLATFORM_ICONS.twitter
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                Twitter
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="instagram">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={
                                                        PLATFORM_ICONS.instagram
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                Instagram
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="linkedin">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={
                                                        PLATFORM_ICONS.linkedin
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                LinkedIn
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Tabs
                                    value={viewMode}
                                    onValueChange={setViewMode}
                                >
                                    <TabsList>
                                        <TabsTrigger value="month">
                                            <Icon
                                                icon="lucide:calendar"
                                                className="mr-2 h-4 w-4"
                                            />
                                            Month
                                        </TabsTrigger>
                                        <TabsTrigger value="week" disabled>
                                            <Icon
                                                icon="lucide:calendar-days"
                                                className="mr-2 h-4 w-4"
                                            />
                                            Week
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Calendar Grid */}
                        <div className="rounded-lg border">
                            {/* Week Day Headers */}
                            <div className="grid grid-cols-7 border-b bg-muted/50">
                                {weekDays.map((day) => (
                                    <div
                                        key={day}
                                        className="border-r p-2 text-center text-sm font-semibold last:border-r-0"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7">
                                {calendarDays.map((day, index) => {
                                    const dayPosts = getPostsForDate(day);
                                    const isCurrentMonth = isSameMonth(
                                        day,
                                        currentDate
                                    );
                                    const isTodayDate = isToday(day);

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className={cn(
                                                "min-h-[120px] border-b border-r p-2 last:border-r-0",
                                                !isCurrentMonth &&
                                                    "bg-muted/20",
                                                index >=
                                                    calendarDays.length - 7 &&
                                                    "border-b-0"
                                            )}
                                        >
                                            <div className="mb-1 flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDateClick(day)
                                                    }
                                                    className={cn(
                                                        "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors hover:bg-accent",
                                                        isTodayDate &&
                                                            "bg-primary text-primary-foreground hover:bg-primary/90",
                                                        !isCurrentMonth &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {format(day, "d")}
                                                </button>
                                                {dayPosts.length > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-5 px-1.5 text-xs"
                                                    >
                                                        {dayPosts.length}
                                                    </Badge>
                                                )}
                                            </div>

                                            <ScrollArea className="h-[80px]">
                                                <div className="space-y-1">
                                                    {dayPosts.map((post) => (
                                                        <button
                                                            key={post.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handlePostClick(
                                                                    post
                                                                )
                                                            }
                                                            className="w-full text-left"
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "rounded border px-2 py-1 text-xs transition-colors hover:shadow-sm",
                                                                    post.is_draft
                                                                        ? "border-dashed bg-muted/50 text-muted-foreground"
                                                                        : PLATFORM_COLORS[
                                                                              post
                                                                                  .channels[0]
                                                                                  ?.platform
                                                                          ] ||
                                                                              "bg-accent"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    {post
                                                                        .channels[0] && (
                                                                        <Icon
                                                                            icon={
                                                                                PLATFORM_ICONS[
                                                                                    post
                                                                                        .channels[0]
                                                                                        .platform
                                                                                ]
                                                                            }
                                                                            className="h-3 w-3 flex-shrink-0"
                                                                        />
                                                                    )}
                                                                    <span className="truncate font-medium">
                                                                        {post.content.substring(
                                                                            0,
                                                                            30
                                                                        )}
                                                                        {post
                                                                            .content
                                                                            .length >
                                                                            30 &&
                                                                            "..."}
                                                                    </span>
                                                                </div>
                                                                <div className="mt-0.5 text-[10px] opacity-75">
                                                                    {format(
                                                                        parseISO(
                                                                            post.published_at
                                                                        ),
                                                                        "h:mm a"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded bg-primary" />
                                <span>Today</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded border border-dashed bg-muted/50" />
                                <span>Draft</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded bg-blue-500/10 border border-blue-500/20" />
                                <span>Scheduled</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Unscheduled Posts Queue & AI Suggestions Row */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Unscheduled Posts Queue */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Icon
                                            icon="lucide:inbox"
                                            className="h-5 w-5 text-orange-500"
                                        />
                                        Unscheduled Queue
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Draft posts waiting to be scheduled
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="h-6">
                                    {
                                        posts.filter(
                                            (p) => !p.published_at || p.is_draft
                                        ).length
                                    }
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px] pr-4">
                                <div className="space-y-2">
                                    {posts.filter((p) => p.is_draft).length >
                                    0 ? (
                                        posts
                                            .filter((p) => p.is_draft)
                                            .slice(0, 5)
                                            .map((post) => (
                                                <button
                                                    key={post.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handlePostClick(post)
                                                    }
                                                    className="w-full text-left p-3 rounded-lg border border-dashed bg-muted/30 hover:bg-muted/50 transition-colors group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1">
                                                            <Icon
                                                                icon={
                                                                    post.post_type ===
                                                                    "text"
                                                                        ? "lucide:type"
                                                                        : post.post_type ===
                                                                          "visual"
                                                                        ? "lucide:image"
                                                                        : "lucide:video"
                                                                }
                                                                className="h-4 w-4 text-muted-foreground"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                                                {post.content}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                {post.channels
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            channel
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    channel.id
                                                                                }
                                                                                variant="outline"
                                                                                className="h-5 px-1.5 text-xs"
                                                                            >
                                                                                <Icon
                                                                                    icon={
                                                                                        PLATFORM_ICONS[
                                                                                            channel
                                                                                                .platform
                                                                                        ]
                                                                                    }
                                                                                    className="h-3 w-3"
                                                                                />
                                                                            </Badge>
                                                                        )
                                                                    )}
                                                                {post.channels
                                                                    .length >
                                                                    3 && (
                                                                    <span className="text-xs text-muted-foreground">
                                                                        +
                                                                        {post
                                                                            .channels
                                                                            .length -
                                                                            3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Icon
                                                            icon="lucide:chevron-right"
                                                            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                                                        />
                                                    </div>
                                                </button>
                                            ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Icon
                                                icon="lucide:check-circle"
                                                className="h-12 w-12 text-muted-foreground/50 mb-3"
                                            />
                                            <p className="text-sm font-medium text-muted-foreground">
                                                All clear!
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                No unscheduled posts
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* AI-Suggested Best Posting Times */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Icon
                                            icon="lucide:sparkles"
                                            className="h-5 w-5 text-purple-500"
                                        />
                                        Best Posting Times
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        AI-suggested optimal times for
                                        engagement
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="h-6 gap-1"
                                >
                                    <Icon
                                        icon="lucide:trending-up"
                                        className="h-3 w-3"
                                    />
                                    AI
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    {
                                        time: "9:00 AM",
                                        days: "Mon-Fri",
                                        platform: "twitter",
                                        engagement: "High",
                                        icon: "lucide:coffee",
                                    },
                                    {
                                        time: "1:00 PM",
                                        days: "Mon-Fri",
                                        platform: "instagram",
                                        engagement: "Peak",
                                        icon: "lucide:sun",
                                    },
                                    {
                                        time: "7:00 PM",
                                        days: "All Days",
                                        platform: "facebook",
                                        engagement: "High",
                                        icon: "lucide:moon",
                                    },
                                    {
                                        time: "8:00 AM",
                                        days: "Tue-Thu",
                                        platform: "linkedin",
                                        engagement: "Peak",
                                        icon: "lucide:briefcase",
                                    },
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => {
                                            const now = new Date();
                                            const [hours, minutes] =
                                                suggestion.time.split(/[: ]/);
                                            const isPM =
                                                suggestion.time.includes("PM");
                                            let hour = parseInt(hours, 10);
                                            if (isPM && hour !== 12) hour += 12;
                                            if (!isPM && hour === 12) hour = 0;

                                            now.setHours(
                                                hour,
                                                parseInt(minutes, 10),
                                                0,
                                                0
                                            );
                                            handleDateClick(now);
                                        }}
                                        className="w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors group text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                                    <Icon
                                                        icon={suggestion.icon}
                                                        className="h-5 w-5 text-purple-600 dark:text-purple-400"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">
                                                            {suggestion.time}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "h-5 px-1.5 text-xs gap-1",
                                                                PLATFORM_COLORS[
                                                                    suggestion
                                                                        .platform
                                                                ]
                                                            )}
                                                        >
                                                            <Icon
                                                                icon={
                                                                    PLATFORM_ICONS[
                                                                        suggestion
                                                                            .platform
                                                                    ]
                                                                }
                                                                className="h-3 w-3"
                                                            />
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {suggestion.days}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        suggestion.engagement ===
                                                        "Peak"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="h-6 text-xs"
                                                >
                                                    {suggestion.engagement}
                                                </Badge>
                                                <Icon
                                                    icon="lucide:plus-circle"
                                                    className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-xs text-muted-foreground text-center">
                                    <Icon
                                        icon="lucide:info"
                                        className="h-3 w-3 inline mr-1"
                                    />
                                    Based on your audience activity patterns
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Post Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    {selectedPost && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <DialogTitle>Post Preview</DialogTitle>
                                        <DialogDescription>
                                            Scheduled for{" "}
                                            {format(
                                                parseISO(
                                                    selectedPost.published_at
                                                ),
                                                "PPpp"
                                            )}
                                        </DialogDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedPost.is_draft && (
                                            <Badge variant="outline">
                                                Draft
                                            </Badge>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Icon
                                                        icon="lucide:more-vertical"
                                                        className="h-4 w-4"
                                                    />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route(
                                                            "posts.edit",
                                                            selectedPost.id
                                                        )}
                                                    >
                                                        <Icon
                                                            icon="lucide:edit"
                                                            className="mr-2 h-4 w-4"
                                                        />
                                                        Edit Post
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDuplicatePost(
                                                            selectedPost
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        icon="lucide:copy"
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeletePost(
                                                            selectedPost.id
                                                        )
                                                    }
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Icon
                                                        icon="lucide:trash-2"
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Social Media Preview Card */}
                                <Card>
                                    <CardContent className="p-6">
                                        {/* Post Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                {selectedPost.channels[0]?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">
                                                    {selectedPost.channels[0]
                                                        ?.name || "Your Page"}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>
                                                        {format(
                                                            parseISO(
                                                                selectedPost.published_at
                                                            ),
                                                            "MMM d 'at' h:mm a"
                                                        )}
                                                    </span>
                                                    <span>•</span>
                                                    <Icon
                                                        icon="lucide:globe"
                                                        className="h-3 w-3"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {selectedPost.channels.map(
                                                    (channel) => (
                                                        <Badge
                                                            key={channel.id}
                                                            variant="outline"
                                                            className={cn(
                                                                "gap-1 h-6",
                                                                PLATFORM_COLORS[
                                                                    channel
                                                                        .platform
                                                                ]
                                                            )}
                                                        >
                                                            <Icon
                                                                icon={
                                                                    PLATFORM_ICONS[
                                                                        channel
                                                                            .platform
                                                                    ]
                                                                }
                                                                className="h-3 w-3"
                                                            />
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Post Content with Hashtags */}
                                        <div className="mb-4">
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                {selectedPost.content
                                                    .split(/(\s+)/)
                                                    .map((word, i) => {
                                                        if (
                                                            word.startsWith("#")
                                                        ) {
                                                            return (
                                                                <span
                                                                    key={i}
                                                                    className="text-blue-600 dark:text-blue-400 font-medium"
                                                                >
                                                                    {word}
                                                                </span>
                                                            );
                                                        }
                                                        return (
                                                            <span key={i}>
                                                                {word}
                                                            </span>
                                                        );
                                                    })}
                                            </p>
                                        </div>

                                        {/* Media Preview */}
                                        {selectedPost.media &&
                                        selectedPost.media.length > 0 ? (
                                            <div
                                                className={cn(
                                                    "rounded-lg overflow-hidden border bg-muted",
                                                    selectedPost.media
                                                        .length === 1
                                                        ? "aspect-video"
                                                        : "grid grid-cols-2 gap-1"
                                                )}
                                            >
                                                {selectedPost.media
                                                    .slice(0, 4)
                                                    .map((media, index) => (
                                                        <div
                                                            key={
                                                                media.id ||
                                                                index
                                                            }
                                                            className={cn(
                                                                "relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
                                                                selectedPost
                                                                    .media
                                                                    .length ===
                                                                    1
                                                                    ? "aspect-video"
                                                                    : "aspect-square"
                                                            )}
                                                        >
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                                                <Icon
                                                                    icon="lucide:image"
                                                                    className="h-12 w-12 mb-2"
                                                                />
                                                                <span className="text-xs">
                                                                    {media.name ||
                                                                        "Image"}
                                                                </span>
                                                            </div>
                                                            {index === 3 &&
                                                                selectedPost
                                                                    .media
                                                                    .length >
                                                                    4 && (
                                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                        <span className="text-white text-2xl font-bold">
                                                                            +
                                                                            {selectedPost
                                                                                .media
                                                                                .length -
                                                                                4}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                                                <div className="text-center text-muted-foreground">
                                                    <Icon
                                                        icon="lucide:image-off"
                                                        className="h-16 w-16 mx-auto mb-2 opacity-50"
                                                    />
                                                    <p className="text-sm">
                                                        No media attached
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Social Actions */}
                                        <div className="flex items-center gap-6 pt-4 mt-4 border-t">
                                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                <Icon
                                                    icon="lucide:heart"
                                                    className="h-5 w-5"
                                                />
                                                <span>Like</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                <Icon
                                                    icon="lucide:message-circle"
                                                    className="h-5 w-5"
                                                />
                                                <span>Comment</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                <Icon
                                                    icon="lucide:share-2"
                                                    className="h-5 w-5"
                                                />
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Post Details */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Post Type
                                        </Label>
                                        <div className="mt-2">
                                            <Badge
                                                variant="secondary"
                                                className="capitalize"
                                            >
                                                <Icon
                                                    icon={
                                                        selectedPost.post_type ===
                                                        "text"
                                                            ? "lucide:type"
                                                            : selectedPost.post_type ===
                                                              "visual"
                                                            ? "lucide:image"
                                                            : "lucide:video"
                                                    }
                                                    className="h-3 w-3 mr-1"
                                                />
                                                {selectedPost.post_type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Status
                                        </Label>
                                        <div className="mt-2">
                                            <Badge
                                                variant={
                                                    selectedPost.is_draft
                                                        ? "outline"
                                                        : "default"
                                                }
                                            >
                                                <Icon
                                                    icon={
                                                        selectedPost.is_draft
                                                            ? "lucide:file-edit"
                                                            : "lucide:calendar-check"
                                                    }
                                                    className="h-3 w-3 mr-1"
                                                />
                                                {selectedPost.is_draft
                                                    ? "Draft"
                                                    : "Scheduled"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Quick Create Dialog */}
            <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Schedule New Post</DialogTitle>
                        <DialogDescription>
                            {selectedDate && format(selectedDate, "PPPP")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="What would you like to share?"
                                value={data.content}
                                onChange={(e) =>
                                    setData("content", e.target.value)
                                }
                                className="min-h-[150px]"
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive">
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="channels">Select Channels</Label>
                            <Select
                                value={data.channels[0] || ""}
                                onValueChange={(value) =>
                                    setData("channels", [parseInt(value, 10)])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(groupedChannels).map(
                                        ([platform, platformChannels]) => (
                                            <div key={platform}>
                                                {platformChannels.map(
                                                    (channel) => (
                                                        <SelectItem
                                                            key={channel.id}
                                                            value={channel.id.toString()}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Icon
                                                                    icon={
                                                                        PLATFORM_ICONS[
                                                                            channel
                                                                                .platform
                                                                        ]
                                                                    }
                                                                    className="h-4 w-4"
                                                                />
                                                                {channel.name}
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </div>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.channels && (
                                <p className="text-sm text-destructive">
                                    {errors.channels}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="published_at">
                                Publish Date & Time
                            </Label>
                            <Input
                                id="published_at"
                                type="datetime-local"
                                value={data.published_at}
                                onChange={(e) =>
                                    setData("published_at", e.target.value)
                                }
                            />
                            {errors.published_at && (
                                <p className="text-sm text-destructive">
                                    {errors.published_at}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setQuickCreateOpen(false);
                                    reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleQuickCreate}
                                disabled={processing}
                            >
                                {processing ? "Scheduling..." : "Schedule Post"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
