import { useState } from "react";
import { ConfirmDeleteDialog } from "~/components/ConfirmDeleteDialog";
import { useDeletePost } from "~/hooks/usePosts";
import type { PostWithUser } from "~/data-access/posts";

interface DeletePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostWithUser | null;
}

export function DeletePostDialog({
  open,
  onOpenChange,
  post,
}: DeletePostDialogProps) {
  const deletePostMutation = useDeletePost();

  const handleDelete = () => {
    if (post) {
      deletePostMutation.mutate(post.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const postTitle = post?.title || "this post";

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleDelete}
      isPending={deletePostMutation.isPending}
      title="Delete Post"
      description={`Are you sure you want to delete "${postTitle}"? This action cannot be undone and will permanently remove the post from the community.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
    />
  );
}
