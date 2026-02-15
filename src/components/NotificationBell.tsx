import { useNavigate } from "@tanstack/react-router";
import type { Key } from "react";
import { Bell, Check, MessageSquare, Reply } from "lucide-react";
import { Button, Dropdown } from "@heroui/react";
import {
  useUnreadCount,
  useRecentNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "~/hooks/useNotifications";
import { cn } from "~/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { NotificationWithUser } from "~/data-access/notifications";

function getNotificationIcon(type: string) {
  switch (type) {
    case "post-reply":
      return <MessageSquare className="h-4 w-4 text-primary" />;
    case "comment-reply":
      return <Reply className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
}

function NotificationItem({ notification }: { notification: NotificationWithUser }) {
  return (
    <Dropdown.Item
      id={`notification:${notification.id}`}
      textValue={notification.title}
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer",
        !notification.isRead && "bg-primary/5"
      )}
    >
      <div className="shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !notification.isRead && "font-medium")}>
          {notification.title}
        </p>
        {notification.content && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.content}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!notification.isRead && (
        <div className="shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </Dropdown.Item>
  );
}

export function NotificationBell() {
  const navigate = useNavigate();
  const { data: countData } = useUnreadCount(true);
  const { data: notifications } = useRecentNotifications(true);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = countData?.count ?? 0;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  const handleAction = (key: Key) => {
    if (typeof key !== "string") return;
    if (key === "mark-all") {
      markAllAsRead.mutate();
      return;
    }
    if (key === "view-all") {
      navigate({ to: "/dashboard/notifications" });
      return;
    }
    if (key.startsWith("notification:")) {
      const notificationId = key.replace("notification:", "");
      const notification = notifications?.find((item) => item.id === notificationId);
      if (!notification) return;
      if (!notification.isRead) {
        markAsRead.mutate(notification.id);
      }
      if (notification.relatedId) {
        navigate({
          to: "/dashboard/community/post/$postId",
          params: { postId: notification.relatedId },
        });
      }
    }
  };

  return (
    <Dropdown>
      <Button variant="ghost" className="relative h-9 w-9" isIconOnly>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {displayCount}
          </span>
        )}
        <span className="sr-only">
          {unreadCount > 0
            ? `${unreadCount} unread notifications`
            : "Notifications"}
        </span>
      </Button>
      <Dropdown.Popover className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="p-0 font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onPress={() => markAllAsRead.mutate()}
              isDisabled={markAllAsRead.isPending}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <Dropdown.Menu onAction={handleAction} aria-label="Notifications">
          {notifications && notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
              <Dropdown.Item
                id="view-all"
                textValue="View all notifications"
                className="flex items-center justify-center py-2 text-sm font-medium text-primary hover:text-primary"
              >
                View all notifications
              </Dropdown.Item>
            </>
          ) : (
            <Dropdown.Item id="empty" textValue="No notifications" isDisabled>
              <div className="py-6 text-center text-sm text-muted-foreground w-full">
                No notifications yet
              </div>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
