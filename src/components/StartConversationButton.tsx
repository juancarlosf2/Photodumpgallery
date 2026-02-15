import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@heroui/react";
import { useStartConversation } from "~/hooks/useConversations";

interface StartConversationButtonProps {
  userId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function StartConversationButton({
  userId,
  variant = "default",
  size = "default",
  className,
}: StartConversationButtonProps) {
  const startConversation = useStartConversation();
  const resolvedVariant = variant === "default" ? "primary" : variant;
  const resolvedSize = size === "default" ? "md" : size === "icon" ? "sm" : size;
  const isIconOnly = size === "icon";
  const label = "Send Message";

  const handleClick = () => {
    startConversation.mutate(userId);
  };

  return (
    <Button
      variant={resolvedVariant}
      size={resolvedSize}
      isIconOnly={isIconOnly}
      onPress={handleClick}
      isDisabled={startConversation.isPending}
      className={className}
      aria-label={isIconOnly ? label : undefined}
    >
      {startConversation.isPending ? (
        <Loader2 className={isIconOnly ? "h-4 w-4 animate-spin" : "h-4 w-4 animate-spin mr-2"} />
      ) : (
        <MessageSquare className={isIconOnly ? "h-4 w-4" : "h-4 w-4 mr-2"} />
      )}
      {!isIconOnly && label}
    </Button>
  );
}
