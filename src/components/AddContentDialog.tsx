import { Modal } from "@heroui/react";
import { ContentForm, type ContentSubmitData } from "~/components/ContentForm";
import { useCreateModuleContent } from "~/hooks/useModules";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  moduleTitle: string;
}

export function AddContentDialog({
  open,
  onOpenChange,
  moduleId,
  moduleTitle,
}: AddContentDialogProps) {
  const createContentMutation = useCreateModuleContent();

  const handleSubmit = async (data: ContentSubmitData) => {
    createContentMutation.mutate(
      { moduleId, ...data },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <span className="hidden" />
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add Content</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-muted-foreground">
                Add content to "{moduleTitle}". You can add videos, tasks, PDFs,
                images, or text.
              </p>
              <ContentForm
                key={moduleId}
                onSubmit={handleSubmit}
                isPending={createContentMutation.isPending}
                submitLabel="Add Content"
                onCancel={() => onOpenChange(false)}
                cancelLabel="Cancel"
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
