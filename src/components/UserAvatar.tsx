import { Avatar } from "@heroui/react";
import { useAvatarImage } from "~/hooks/useAvatarImage";
import { getInitials } from "~/utils/user";

interface UserAvatarProps {
  imageKey: string | null;
  name: string | null;
  email?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-24 w-24",
};

export function UserAvatar({
  imageKey,
  name,
  email,
  className = "",
  size = "md",
}: UserAvatarProps) {
  const { avatarUrl } = useAvatarImage(imageKey);

  // Get fallback text - use name initials, or first letter of email, or "U"
  const fallbackText =
    name
      ? getInitials(name)
      : email
        ? email.charAt(0).toUpperCase()
        : "U";

  return (
    <Avatar className={`${sizeMap[size]} ${className}`}>
      {avatarUrl && <Avatar.Image src={avatarUrl} alt={name || "User"} />}
      <Avatar.Fallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-semibold">
        {fallbackText}
      </Avatar.Fallback>
    </Avatar>
  );
}
