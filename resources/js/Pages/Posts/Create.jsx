import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Button } from "@/Components/shadcn/ui/button";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { Textarea } from "@/Components/shadcn/ui/textarea";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import InputError from "@/Components/InputError";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcn/ui/select";

export default function PostsCreate() {
    const { channels } = usePage().props;
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: "",
        channels: [],
        media: null,
        is_scheduled: false,
        published_at: "",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("posts.store"), {
            forceFormData: true,
        });
    };

    const toggleChannel = (channelValue) => {
        const current = selectedChannels.includes(channelValue)
            ? selectedChannels.filter((c) => c !== channelValue)
            : [...selectedChannels, channelValue];

        setSelectedChannels(current);
        setData("channels", current);
    };

    return (
        <AppLayout title="Create Post">
            <div className="mx-auto max-w-4xl space-y-6">
                <h2 className="text-2xl font-bold">Create Post</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-lg border bg-card p-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="channels">Channels</Label>
                        <div className="space-y-2">
                            {channels.map((channel) => (
                                <div
                                    key={channel.value}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`channel-${channel.value}`}
                                        checked={selectedChannels.includes(
                                            channel.value,
                                        )}
                                        onCheckedChange={() =>
                                            toggleChannel(channel.value)
                                        }
                                    />
                                    <label
                                        htmlFor={`channel-${channel.value}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {channel.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.channels} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="What do you like to share?"
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            rows={5}
                        />
                        <InputError message={errors.content} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="media">Media</Label>
                        <Input
                            id="media"
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg"
                            onChange={handleFileSelect}
                        />
                        {previewImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                {previewImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.preview}
                                            alt="Preview"
                                            className="h-32 w-full rounded-md object-cover"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeImage(index)}
                                            className="mt-2 w-full"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.media} />
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Is Scheduled?
                        </label>
                    </div>

                    {data.is_scheduled && (
                        <div className="space-y-2">
                            <Label htmlFor="published_at">Publish At</Label>
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
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creating..." : "Create Post"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
