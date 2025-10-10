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
import { format } from "date-fns";

export default function PostsIndex() {
    const { posts } = usePage().props;

    return (
        <AppLayout title="Posts">
            <div className="space-y-6">
                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href={route("posts.create")}>Create Post</Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content</TableHead>
                                <TableHead>Published At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center"
                                    >
                                        No posts found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.data.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            <Link
                                                href={route("posts.edit", post)}
                                                className="hover:text-primary"
                                            >
                                                {post.content}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {post.published_at
                                                ? format(
                                                      new Date(
                                                          post.published_at,
                                                      ),
                                                      "PPpp",
                                                  )
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Link
                                                        href={route(
                                                            "posts.edit",
                                                            post,
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    <Link
                                                        href={route(
                                                            "posts.destroy",
                                                            post,
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                    >
                                                        Delete
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {posts.links && posts.links.length > 3 && (
                    <Pagination>
                        <PaginationContent>
                            {posts.links.map((link, index) => (
                                <PaginationItem key={index}>
                                    {link.url ? (
                                        index === 0 ? (
                                            <PaginationPrevious
                                                href={link.url}
                                            />
                                        ) : index === posts.links.length - 1 ? (
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
