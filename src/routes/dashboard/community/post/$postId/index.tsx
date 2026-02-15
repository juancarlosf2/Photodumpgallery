import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Home, Users, Clock, Trash2, Edit, Pin, PinOff } from "lucide-react";
import { Page } from "~/components/Page";
import { AppBreadcrumb } from "~/components/AppBreadcrumb";
import { Button, Card, Chip } from "@heroui/react";
import { postQueryOptions } from "~/queries/posts";
import { formatRelativeTime } from "~/utils/song";
import { authClient } from "~/lib/auth-client";
import { DeletePostDialog } from "~/components/DeletePostDialog";
import { UserAvatarLink } from "~/components/UserAvatarLink";
import { UserNameLink } from "~/components/UserNameLink";
import { CommentList } from "~/components/CommentList";
import { useIsAdmin, usePinPost } from "~/hooks/usePosts";
import { PostLikeButton } from "~/components/PostLikeButton";
import { MediaGallery } from "~/components/MediaGallery";
import { usePostAttachments } from "~/hooks/useAttachments";

const MAX_VISIBLE_ATTACHMENTS = 6;

export const Route = createFileRoute("/dashboard/community/post/$postId/")({
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    // Use prefetchQuery instead of ensureQueryData to avoid throwing on errors
    // The component will handle the error state
    await queryClient.prefetchQuery(postQueryOptions(postId));
  },
  component: PostDetail,
});

function getCategoryChipProps(category: string | null): {
  variant: "primary" | "secondary" | "tertiary";
  color: "accent" | "warning" | "default";
} {
  switch (category) {
    case "announcement":
      return { variant: "primary", color: "accent" };
    case "question":
      return { variant: "secondary", color: "warning" };
    default:
      return { variant: "tertiary", color: "default" };
  }
}

function PostDetail() {
  const { postId } = Route.useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useQuery(postQueryOptions(postId));
  const { data: session } = authClient.useSession();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: adminData } = useIsAdmin();
  const pinPost = usePinPost();
  const { data: attachments = [] } = usePostAttachments(postId);
  const isOwner = session?.user?.id === post?.userId;
  const isAdmin = adminData?.isAdmin ?? false;

  const handleEditClick = () => {
    navigate({ to: `/dashboard/community/post/$postId/edit`, params: { postId } });
  };

  const handlePinClick = () => {
    if (post) {
      pinPost.mutate({ id: post.id, isPinned: !post.isPinned });
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", to: "/dashboard" },
    {
      label: "Community",
      to: "/dashboard/community",
      search: { category: undefined },
      icon: Users,
    },
    { label: post?.title || "Post" },
  ];

  if (isLoading) {
    return (
      <Page>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !post) {
    return (
      <Page>
        <div className="text-center space-y-4 py-12">
          <h1 className="text-2xl font-bold text-destructive">
            Post Not Found
          </h1>
          <p className="text-muted-foreground">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/dashboard/community"
            search={{ category: undefined }}
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Back to Community
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-8 max-w-4xl mx-auto">
        <AppBreadcrumb items={breadcrumbItems} />

        {/* Main Post */}
        <Card>
          <Card.Header className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                {/* Category and Pinned Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {post.category && (
                    <Chip {...getCategoryChipProps(post.category)}>
                      {post.category}
                    </Chip>
                  )}
                  {post.isPinned && (
                    <Chip variant="secondary" color="accent" className="gap-1">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Chip>
                  )}
                </div>

                {/* Title */}
                {post.title && (
                  <h1 className="text-3xl font-bold">{post.title}</h1>
                )}

                {/* Author and Timestamp */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <UserAvatarLink
                      userId={post.user.id}
                      imageKey={post.user.image}
                      name={post.user.name}
                      size="md"
                    />
                    <div>
                      <UserNameLink
                        userId={post.user.id}
                        name={post.user.name}
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatRelativeTime(
                            new Date(post.createdAt).toISOString()
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(isOwner || isAdmin) && (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      className={`${post.isPinned ? "text-primary hover:text-primary" : ""} hover:bg-accent`}
                      onPress={handlePinClick}
                      isDisabled={pinPost.isPending}
                      aria-label={post.isPinned ? "Unpin post" : "Pin post"}
                    >
                      {post.isPinned ? (
                        <PinOff className="h-4 w-4" />
                      ) : (
                        <Pin className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {isOwner && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        className="hover:bg-accent"
                        onPress={handleEditClick}
                        aria-label="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onPress={() => setDeleteDialogOpen(true)}
                        aria-label="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card.Header>

          <Card.Content className="space-y-4">
            {/* Post Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Post Attachments */}
            {attachments.length > 0 && (
              <MediaGallery
                attachments={attachments}
                size="lg"
                maxVisible={MAX_VISIBLE_ATTACHMENTS}
                layout="thumbnails"
                className="mt-4"
              />
            )}

            {/* Like Button */}
            <div className="pt-2 border-t border-border">
              <PostLikeButton postId={post.id} />
            </div>
          </Card.Content>
        </Card>

        {/* Comments Section */}
        <CommentList postId={postId} />

        {/* Delete Post Dialog */}
        {post && (
          <DeletePostDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            post={post}
          />
        )}
      </div>
    </Page>
  );
}
