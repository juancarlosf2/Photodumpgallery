import { Modal } from "@heroui/react";
import { EventForm, type EventSubmitData } from "~/components/EventForm";
import { useCreateEvent, useUpdateEvent } from "~/hooks/useEvents";
import { dateToLocalDateTime, createDateWithTime } from "~/utils/date";
import type { EventWithUser } from "~/data-access/events";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Event to edit. If null/undefined, dialog is in create mode */
  event?: EventWithUser | null;
  /** Initial date for new events (only used in create mode) */
  initialDate?: Date;
}

function getDefaultValuesForCreate(initialDate?: Date) {
  if (!initialDate) return undefined;

  return {
    startTime: dateToLocalDateTime(createDateWithTime(initialDate, 9)),
    endTime: dateToLocalDateTime(createDateWithTime(initialDate, 10)),
  };
}

function getDefaultValuesForEdit(event: EventWithUser) {
  return {
    title: event.title,
    description: event.description || "",
    startTime: dateToLocalDateTime(new Date(event.startTime)),
    endTime: event.endTime
      ? dateToLocalDateTime(new Date(event.endTime))
      : "",
    eventLink: event.eventLink || "",
    eventType: event.eventType as
      | "live-session"
      | "workshop"
      | "meetup"
      | "assignment-due",
  };
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  initialDate,
}: EventDialogProps) {
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  const isEditMode = !!event;
  const mutation = isEditMode ? updateEventMutation : createEventMutation;

  const defaultValues = isEditMode
    ? getDefaultValuesForEdit(event)
    : getDefaultValuesForCreate(initialDate);

  const handleSubmit = async (data: EventSubmitData) => {
    if (isEditMode) {
      updateEventMutation.mutate(
        { id: event.id, ...data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createEventMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <span className="hidden" />
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEditMode ? "Edit Event" : "Create Event"}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update the event details."
                  : "Add a new event to the community calendar."}
              </p>
              <EventForm
                key={isEditMode ? event.id : initialDate?.toISOString()}
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isPending={mutation.isPending}
                submitLabel={isEditMode ? "Save Changes" : "Create Event"}
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
