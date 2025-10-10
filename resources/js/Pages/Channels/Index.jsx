import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Button } from "@/Components/shadcn/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/shadcn/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/shadcn/ui/pagination";

export default function ChannelsIndex() {
    const { channels } = usePage().props;

    return (
        <AppLayout title="Channels">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                    <Button
                        asChild
                        variant="default"
                        className="bg-gradient-to-r from-[#4267B2] to-[#d62976] hover:from-[#2e4d8d] hover:to-[#bf265d]"
                    >
                        <a href={route("channels.redirect", "facebook")}>
                            Connect Facebook + Instagram
                        </a>
                    </Button>

                    <Button
                        asChild
                        variant="default"
                        className="bg-[#1DA1F2] hover:bg-[#1787cc]"
                    >
                        <a href={route("channels.redirect", "twitter")}>
                            Connect Twitter
                        </a>
                    </Button>

                    <Button
                        asChild
                        variant="default"
                        className="bg-[#0A66C2] hover:bg-[#084C93FF]"
                    >
                        <a href={route("channels.redirect", "linkedin")}>
                            Connect Linkedin
                        </a>
                    </Button>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Platform ID</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {channels.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center"
                                    >
                                        No channels found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                channels.data.map((channel) => (
                                    <TableRow key={channel.id}>
                                        <TableCell>
                                            <Link
                                                href={route(
                                                    "channels.edit",
                                                    channel,
                                                )}
                                                className="hover:text-primary"
                                            >
                                                {channel.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {channel.platform_id}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {channel.platform}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {channel.type}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {channels.links && channels.links.length > 3 && (
                    <Pagination>
                        <PaginationContent>
                            {channels.links.map((link, index) => (
                                <PaginationItem key={index}>
                                    {link.url ? (
                                        index === 0 ? (
                                            <PaginationPrevious
                                                href={link.url}
                                            />
                                        ) : index ===
                                          channels.links.length - 1 ? (
                                            <PaginationNext href={link.url} />
                                        ) : (
                                            <PaginationLink
                                                href={link.url}
                                                isActive={link.active}
                                            >
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
    );
}
