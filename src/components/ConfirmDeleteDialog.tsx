import { Button, AlertDialog } from "@heroui/react";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  title = "Delete",
  description = "Are you sure? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog isOpen={open} onOpenChange={onOpenChange}>
      <span className="hidden" />
      <AlertDialog.Backdrop variant="blur">
        <AlertDialog.Container placement="auto">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm text-muted-foreground">{description}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="outline"
                slot="close"
                isDisabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="danger"
                onPress={onConfirm}
                isDisabled={isPending}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
