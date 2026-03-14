import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/posts';
import type { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    body: string;
    published_at: string;
    user: User;
    featured_image_url: string | null;
}

interface Props {
    posts: Post[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

export default function PostsIndex({ posts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Posts</h1>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus className="size-4" />
                            Create Post
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-card dark:border-sidebar-border"
                        >
                            {post.featured_image_url && (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="line-clamp-2 text-lg font-semibold">
                                    {post.title}
                                </h2>
                                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                    {post.body}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>By {post.user.name}</span>
                                    <span>•</span>
                                    <span>
                                        {new Date(
                                            post.published_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
