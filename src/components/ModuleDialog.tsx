import { Modal } from "@heroui/react";
import { ModuleForm, type ModuleSubmitData } from "~/components/ModuleForm";
import { useCreateModule, useUpdateModule } from "~/hooks/useModules";
import type { ClassroomModuleWithUser } from "~/data-access/modules";

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Module to edit. If null/undefined, dialog is in create mode */
  module?: ClassroomModuleWithUser | null;
}

function getDefaultValuesForEdit(module: ClassroomModuleWithUser) {
  return {
    title: module.title,
    description: module.description || "",
    isPublished: module.isPublished,
  };
}

export function ModuleDialog({
  open,
  onOpenChange,
  module,
}: ModuleDialogProps) {
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();

  const isEditMode = !!module;
  const mutation = isEditMode ? updateModuleMutation : createModuleMutation;

  const defaultValues = isEditMode
    ? getDefaultValuesForEdit(module)
    : undefined;

  const handleSubmit = async (data: ModuleSubmitData) => {
    if (isEditMode) {
      updateModuleMutation.mutate(
        { id: module.id, ...data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createModuleMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={open} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <Modal.Header>
              <Modal.Heading>
                {isEditMode ? "Edit Module" : "Create Module"}
              </Modal.Heading>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update the module details."
                  : "Add a new module to organize educational content."}
              </p>
            </Modal.Header>
            <Modal.Body>
              <ModuleForm
                key={isEditMode ? module.id : "create"}
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isPending={mutation.isPending}
                submitLabel={isEditMode ? "Save Changes" : "Create Module"}
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
