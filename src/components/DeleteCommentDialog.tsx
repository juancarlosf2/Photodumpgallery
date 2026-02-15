import { ConfirmDeleteDialog } from "~/components/ConfirmDeleteDialog";
import { useDeleteComment } from "~/hooks/useComments";
import type { CommentWithUser } from "~/data-access/comments";

interface DeleteCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: CommentWithUser | null;
}

export function DeleteCommentDialog({
  open,
  onOpenChange,
  comment,
}: DeleteCommentDialogProps) {
  const deleteCommentMutation = useDeleteComment();

  const handleDelete = () => {
    if (comment) {
      deleteCommentMutation.mutate(comment.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleDelete}
      isPending={deleteCommentMutation.isPending}
      title="Delete Comment"
      description="Are you sure you want to delete this comment? This action cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
    />
  );
}
