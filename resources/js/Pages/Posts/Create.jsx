import { Icon } from "@iconify/react";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import InputError from "@/Components/InputError";
import { cn } from "@/Components/lib/utils";
import { Button } from "@/Components/shadcn/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/shadcn/ui/card";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/shadcn/ui/dialog";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/shadcn/ui/popover";
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

const PLATFORM_LIMITS = {
    facebook: 63206,
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    reddit: 40000,
};

const PLATFORM_ICONS = {
    facebook: "mdi:facebook",
    twitter: "mdi:twitter",
    instagram: "mdi:instagram",
    linkedin: "mdi:linkedin",
    reddit: "mdi:reddit",
};

const IMAGE_RESOLUTIONS = {
    facebook: [
        { value: "1200x630", label: "Standard", description: "1200×630" },
        { value: "1200x1200", label: "Square", description: "1200×1200" },
        { value: "1080x1920", label: "Story", description: "1080×1920" },
    ],
    instagram: [
        { value: "1080x1080", label: "Square", description: "1080×1080" },
        { value: "1080x1350", label: "Portrait", description: "1080×1350" },
        { value: "1080x1920", label: "Story", description: "1080×1920" },
    ],
    twitter: [
        { value: "1200x675", label: "Standard", description: "1200×675" },
        { value: "1200x1200", label: "Square", description: "1200×1200" },
    ],
    linkedin: [
        { value: "1200x627", label: "Standard", description: "1200×627" },
        { value: "1200x1200", label: "Square", description: "1200×1200" },
    ],
};

export default function PostsCreate() {
    const { groupedChannels } = usePage().props;
    const [postType, setPostType] = useState("text");
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [imageResolution, setImageResolution] = useState("1200x630");
    const [channelPopoverOpen, setChannelPopoverOpen] = useState(false);
    const [enableFirstComment, setEnableFirstComment] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        post_type: "text",
        ai_tone: "friendly",
        content: "",
        channels: [],
        media: null,
        platform_configs: {},
        is_scheduled: false,
        published_at: "",
        is_draft: false,
        first_comment: "",
    });

    useEffect(() => {
        setData("post_type", postType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postType]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setData("media", files);

        // Create previews
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve({ file, preview: reader.result });
                reader.onerror = (error) => reject(error);
            });
        });

        Promise.all(promises).then(setPreviewImages);
    };

    const removeImage = (index) => {
        const newFiles = [...data.media];
        newFiles.splice(index, 1);
        setData("media", newFiles);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (isDraft = false) => {
        if (selectedChannels.length === 0) {
            toast.error("Please select at least one channel");
            return;
        }

        // Ensure computed fields are included without relying on async state updates
        transform((current) => ({
            ...current,
            channels: selectedChannels.map((ch) => ch.id),
            is_draft: isDraft,
        }));

        // eslint-disable-next-line no-undef
        post(route("posts.store"), {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    isDraft
                        ? "Draft saved successfully!"
                        : "Post created successfully!"
                );
            },
            onError: () => {
                toast.error("Failed to create post");
            },
        });
    };

    const toggleChannelSelection = (channel) => {
        setSelectedChannels((prev) => {
            const exists = prev.find((ch) => ch.id === channel.id);
            if (exists) {
                return prev.filter((ch) => ch.id !== channel.id);
            }
            return [...prev, channel];
        });
    };

    const removeChannel = (channelId) => {
        setSelectedChannels((prev) => prev.filter((ch) => ch.id !== channelId));
    };

    const handleGenerateContent = async () => {
        if (!aiPrompt.trim()) {
            toast.error("Please describe what you want to post about");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch("/prism/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: `You are a social media content creator. Generate engaging post content in a ${data.ai_tone} tone. Keep it concise and appropriate for social media platforms.`,
                        },
                        {
                            role: "user",
                            content: aiPrompt,
                        },
                    ],
                }),
            });

            const result = await response.json();

            if (result.choices && result.choices[0]?.message?.content) {
                setData("content", result.choices[0].message.content);
                toast.success("Content generated successfully!");
                setAiPrompt("");
            } else {
                toast.error("Failed to generate content");
            }
        } catch (error) {
            toast.error("An error occurred while generating content");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getAllChannels = () => {
        const channels = [];
        Object.entries(groupedChannels || {}).forEach(
            ([platform, platformChannels]) => {
                platformChannels.forEach((channel) => {
                    channels.push({ ...channel, platform });
                });
            }
        );
        return channels;
    };

    const getCharacterLimit = () => {
        // Get limit based on first selected channel's platform, or default to Facebook
        const platform = selectedChannels[0]?.platform || "facebook";
        return PLATFORM_LIMITS[platform] || 63206;
    };

    const getCharacterPercentage = () => {
        const limit = getCharacterLimit();
        return (data.content.length / limit) * 100;
    };

    const getLimitColor = () => {
        const percentage = getCharacterPercentage();
        if (percentage > 90) return "bg-red-500";
        if (percentage > 75) return "bg-yellow-500";
        return "bg-blue-500";
    };

    const allChannels = getAllChannels();
    const availableChannels = allChannels.filter(
        (channel) => !selectedChannels.find((ch) => ch.id === channel.id)
    );

    // Group available channels by platform for organized display
    const groupedAvailableChannels = availableChannels.reduce(
        (acc, channel) => {
            if (!acc[channel.platform]) {
                acc[channel.platform] = [];
            }
            acc[channel.platform].push(channel);
            return acc;
        },
        {}
    );

    return (
        <AppLayout title="Post Builder">
            <div className="container mx-auto max-w-7xl space-y-6">
                {/* Header Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Post Builder</h2>
                        <p className="text-sm text-muted-foreground">
                            Create engaging content for multiple social
                            platforms
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleSubmit(true)}
                            disabled={processing}
                        >
                            <Icon
                                icon="mdi:content-save"
                                className="mr-2 h-4 w-4"
                            />
                            Save Draft
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setScheduleModalOpen(true)}
                        >
                            <Icon
                                icon="mdi:calendar-clock"
                                className="mr-2 h-4 w-4"
                            />
                            Schedule Post
                        </Button>
                        <Button
                            onClick={() => handleSubmit(false)}
                            disabled={processing}
                        >
                            <Icon
                                icon="mdi:rocket-launch"
                                className="mr-2 h-4 w-4"
                            />
                            {processing ? "Publishing..." : "Publish Now"}
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Side: Main Composer (2/3 width) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* AI Assistant */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Icon
                                            icon="mdi:sparkles"
                                            className="h-5 w-5"
                                        />
                                        AI Assistant
                                    </CardTitle>
                                    <Select
                                        value={data.ai_tone}
                                        onValueChange={(value) =>
                                            setData("ai_tone", value)
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">
                                                Professional
                                            </SelectItem>
                                            <SelectItem value="friendly">
                                                Friendly
                                            </SelectItem>
                                            <SelectItem value="casual">
                                                Casual
                                            </SelectItem>
                                            <SelectItem value="formal">
                                                Formal
                                            </SelectItem>
                                            <SelectItem value="humorous">
                                                Humorous
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Let AI help you create better content
                                </p>

                                <div className="space-y-2">
                                    <Label htmlFor="aiPrompt">
                                        Generate Content with AI
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="aiPrompt"
                                            placeholder="Describe what you want to post about..."
                                            value={aiPrompt}
                                            onChange={(e) =>
                                                setAiPrompt(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" &&
                                                    !isGenerating
                                                ) {
                                                    handleGenerateContent();
                                                }
                                            }}
                                            disabled={isGenerating}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleGenerateContent}
                                            disabled={isGenerating}
                                        >
                                            <Icon
                                                icon="mdi:sparkles"
                                                className="mr-2 h-4 w-4"
                                            />
                                            {isGenerating
                                                ? "Generating..."
                                                : "Generate"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:pound"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Suggest Hashtags
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:spellcheck"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Check Grammar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:tune-variant"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Improve Tone
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:translate"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Translate
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:content-cut"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Shorten
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <Tabs
                                    value={postType}
                                    onValueChange={setPostType}
                                >
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="text">
                                            <Icon
                                                icon="mdi:text"
                                                className="mr-2 h-4 w-4"
                                            />
                                            Text Post
                                        </TabsTrigger>
                                        <TabsTrigger value="visual">
                                            <Icon
                                                icon="mdi:image"
                                                className="mr-2 h-4 w-4"
                                            />
                                            Visual Post
                                        </TabsTrigger>
                                        <TabsTrigger value="video">
                                            <Icon
                                                icon="mdi:video"
                                                className="mr-2 h-4 w-4"
                                            />
                                            Video Post
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Selected Channels */}
                                <div className="space-y-2">
                                    <Label>Selected Channels</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedChannels.map((channel) => (
                                            <Button
                                                key={channel.id}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() =>
                                                    removeChannel(channel.id)
                                                }
                                            >
                                                <Icon
                                                    icon={
                                                        PLATFORM_ICONS[
                                                            channel.platform
                                                        ]
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                {channel.platform} -{" "}
                                                {channel.name}
                                                <Icon
                                                    icon="mdi:close"
                                                    className="h-3 w-3"
                                                />
                                            </Button>
                                        ))}
                                        <Popover
                                            open={channelPopoverOpen}
                                            onOpenChange={setChannelPopoverOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <Icon
                                                        icon="mdi:plus"
                                                        className="h-4 w-4"
                                                    />
                                                    Add Channel
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-80"
                                                align="start"
                                            >
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-sm">
                                                        Select Channels
                                                    </h4>
                                                    {Object.keys(
                                                        groupedAvailableChannels
                                                    ).length === 0 ? (
                                                        <p className="text-sm text-muted-foreground">
                                                            All channels have
                                                            been selected
                                                        </p>
                                                    ) : (
                                                        Object.entries(
                                                            groupedAvailableChannels
                                                        ).map(
                                                            ([
                                                                platform,
                                                                channels,
                                                            ]) => (
                                                                <div
                                                                    key={
                                                                        platform
                                                                    }
                                                                    className="space-y-2"
                                                                >
                                                                    <h5 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                                                        <Icon
                                                                            icon={
                                                                                PLATFORM_ICONS[
                                                                                    platform
                                                                                ]
                                                                            }
                                                                            className="h-4 w-4"
                                                                        />
                                                                        {
                                                                            platform
                                                                        }
                                                                    </h5>
                                                                    <div className="space-y-1">
                                                                        {channels.map(
                                                                            (
                                                                                channel
                                                                            ) => (
                                                                                <button
                                                                                    key={
                                                                                        channel.id
                                                                                    }
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        toggleChannelSelection(
                                                                                            channel
                                                                                        );
                                                                                    }}
                                                                                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                                                                                >
                                                                                    <div className="font-medium">
                                                                                        {
                                                                                            channel.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-xs text-muted-foreground">
                                                                                        {
                                                                                            channel.label
                                                                                        }
                                                                                    </div>
                                                                                </button>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <InputError message={errors.channels} />
                                </div>

                                {/* Content Area */}
                                <div className="space-y-2">
                                    <Label htmlFor="postContent">
                                        Post Content
                                    </Label>
                                    <Textarea
                                        id="postContent"
                                        placeholder="What would you like to share today? Write something amazing..."
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        className="min-h-[250px]"
                                    />
                                    <InputError message={errors.content} />

                                    {/* Character Limit Indicator */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {data.content.length}
                                        </span>
                                        <div className="flex-1 mx-4">
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${getLimitColor()}`}
                                                    style={{
                                                        width: `${Math.min(
                                                            getCharacterPercentage(),
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-muted-foreground">
                                            {getCharacterLimit().toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Character limit for{" "}
                                        {selectedChannels[0]?.platform ||
                                            "Facebook"}{" "}
                                        (Changes based on selected platform)
                                    </p>
                                </div>

                                {/* Media Upload */}
                                {postType !== "text" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="media">
                                            {postType === "visual"
                                                ? "Upload Images"
                                                : "Upload Video"}
                                        </Label>
                                        <Input
                                            id="media"
                                            type="file"
                                            multiple={postType === "visual"}
                                            accept={
                                                postType === "visual"
                                                    ? "image/*"
                                                    : "video/*"
                                            }
                                            onChange={handleFileSelect}
                                        />
                                        {previewImages.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                                {previewImages.map(
                                                    (image, index) => (
                                                        <div
                                                            key={`preview-${image.preview.substring(
                                                                0,
                                                                50
                                                            )}`}
                                                            className="relative group"
                                                        >
                                                            <img
                                                                src={
                                                                    image.preview
                                                                }
                                                                alt="Preview"
                                                                className="h-32 w-full rounded-md object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    removeImage(
                                                                        index
                                                                    )
                                                                }
                                                                className="absolute top-2 right-2"
                                                            >
                                                                <Icon
                                                                    icon="mdi:close"
                                                                    className="h-4 w-4"
                                                                />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        <InputError message={errors.media} />
                                    </div>
                                )}

                                {/* Composer Tools */}
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:emoticon-outline"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Emoji
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:pound"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Hashtags
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:link-variant"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Link
                                    </Button>
                                    {postType === "text" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setPostType("visual")
                                            }
                                        >
                                            <Icon
                                                icon="mdi:image-plus"
                                                className="mr-2 h-4 w-4"
                                            />
                                            Add Image
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        <Icon
                                            icon="mdi:chart-bar"
                                            className="mr-2 h-4 w-4"
                                        />
                                        Poll
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Resolution Selector - Only for Visual Posts */}
                        {postType === "visual" &&
                            selectedChannels.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Icon
                                                icon="mdi:image-size-select-large"
                                                className="h-5 w-5"
                                            />
                                            Add image
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>
                                                Image Resolution for{" "}
                                                {selectedChannels[0]
                                                    ?.platform || "Facebook"}
                                            </Label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {(
                                                    IMAGE_RESOLUTIONS[
                                                        selectedChannels[0]
                                                            ?.platform ||
                                                            "facebook"
                                                    ] ||
                                                    IMAGE_RESOLUTIONS.facebook
                                                ).map((resolution) => (
                                                    <button
                                                        key={resolution.value}
                                                        type="button"
                                                        onClick={() =>
                                                            setImageResolution(
                                                                resolution.value
                                                            )
                                                        }
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                                            imageResolution ===
                                                                resolution.value
                                                                ? "border-primary bg-primary/5"
                                                                : "border-border hover:border-primary/50"
                                                        )}
                                                    >
                                                        <div className="text-xs font-medium mb-1">
                                                            {
                                                                resolution.description
                                                            }
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {resolution.label}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Additional Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="first-comment"
                                            checked={enableFirstComment}
                                            onCheckedChange={(checked) =>
                                                setEnableFirstComment(checked)
                                            }
                                        />
                                        <label
                                            htmlFor="first-comment"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                        >
                                            <Icon
                                                icon="mdi:comment-text"
                                                className="h-4 w-4"
                                            />
                                            Add First Comment
                                        </label>
                                    </div>
                                    {enableFirstComment && (
                                        <Textarea
                                            placeholder="Write your first comment here..."
                                            value={data.first_comment}
                                            onChange={(e) =>
                                                setData(
                                                    "first_comment",
                                                    e.target.value
                                                )
                                            }
                                            className="min-h-[80px] ml-6"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="auto-reply" />
                                    <label
                                        htmlFor="auto-reply"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                    >
                                        <Icon
                                            icon="mdi:comment-text-outline"
                                            className="h-4 w-4"
                                        />
                                        Enable Keyword-Based Auto Reply
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Live Preview (1/3 width) */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icon
                                        icon="mdi:eye-outline"
                                        className="h-5 w-5"
                                    />
                                    Live Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Preview Content */}
                                <div className="rounded-lg border p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-muted" />
                                        <div>
                                            <div className="font-semibold text-sm">
                                                Your Page
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Just now
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        {data.content || (
                                            <span className="text-muted-foreground">
                                                Your post preview will appear
                                                here as you type...
                                            </span>
                                        )}
                                    </div>
                                    {previewImages.length > 0 && (
                                        <img
                                            src={previewImages[0].preview}
                                            alt="Preview"
                                            className="w-full rounded-md"
                                        />
                                    )}
                                    <div className="flex gap-4 pt-2 border-t text-sm text-muted-foreground">
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                        >
                                            <Icon
                                                icon="mdi:thumb-up-outline"
                                                className="h-4 w-4"
                                            />
                                            Like
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                        >
                                            <Icon
                                                icon="mdi:comment-outline"
                                                className="h-4 w-4"
                                            />
                                            Comment
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                                        >
                                            <Icon
                                                icon="mdi:share-outline"
                                                className="h-4 w-4"
                                            />
                                            Share
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Icon
                                            icon="mdi:lightbulb-outline"
                                            className="h-4 w-4 mt-0.5"
                                        />
                                        <div>
                                            <strong>Tip:</strong> Preview
                                            updates in real-time as you type!
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            <Dialog
                open={scheduleModalOpen}
                onOpenChange={setScheduleModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Icon
                                icon="mdi:calendar-clock"
                                className="h-5 w-5"
                            />
                            Schedule Post
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
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
                            <InputError message={errors.published_at} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_scheduled"
                                checked={data.is_scheduled}
                                onCheckedChange={(checked) =>
                                    setData("is_scheduled", checked)
                                }
                            />
                            <label
                                htmlFor="is_scheduled"
                                className="text-sm font-medium"
                            >
                                Enable scheduling
                            </label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setScheduleModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setScheduleModalOpen(false);
                                    toast.success(
                                        "Post scheduled successfully!"
                                    );
                                }}
                            >
                                Schedule
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
