import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button, Dropdown, Modal } from "@heroui/react";
import { authClient } from "~/lib/auth-client";
import { ModeToggle } from "./mode-toggle";
import { NotificationBell } from "./NotificationBell";
import { MessagesBell } from "./MessagesBell";
import {
  LogOut,
  User,
  Menu,
  Settings,
  Code,
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  UserCircle,
  MessageSquare,
  Bell,
} from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { useState } from "react";
import * as React from "react";
import { cn } from "~/lib/utils";

const dashboardLink = {
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Classroom",
    href: "/dashboard/classroom",
    icon: BookOpen,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: UserCircle,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-8 flex h-14 items-center">
        <div className="mr-4 flex gap-16">
          <Link to="/" className="mr-6 flex items-center space-x-2 group">
            <div className="relative shrink-0">
              <Code className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="hidden font-semibold text-sm sm:inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap leading-none">
              Full Stack Campus
            </span>
          </Link>

          {session && (
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                to={dashboardLink.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  currentPath.startsWith("/dashboard")
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <LayoutDashboard
                  className={`h-4 w-4 relative z-10 transition-transform ${
                    currentPath.startsWith("/dashboard")
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                />
                <span className="relative z-10">{dashboardLink.title}</span>
                <span
                  className={`absolute inset-0 rounded-lg bg-primary/5 transition-opacity duration-200 ${
                    currentPath.startsWith("/dashboard")
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 blur-sm transition-opacity duration-200 ${
                    currentPath.startsWith("/dashboard")
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                ></span>
              </Link>
            </nav>
          )}
        </div>

        {/* Mobile menu */}
        {session && (
          <Modal isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <Modal.Backdrop variant="blur">
              <Modal.Container placement="auto" className="sm:items-start sm:justify-start">
                <Modal.Dialog className="w-full max-w-sm bg-background/90 backdrop-blur-md border border-border/50 sm:rounded-3xl">
                  <Modal.CloseTrigger />
                  <div className="px-7 pt-8 h-full flex flex-col">
                    <Link
                      to="/"
                      className="flex items-center space-x-2 mb-8"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Code className="h-6 w-6 text-primary shrink-0" />
                      <span className="font-semibold text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap leading-none">
                        Full Stack Campus
                      </span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          item.href === "/dashboard"
                            ? currentPath === "/dashboard"
                            : currentPath.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                              isActive
                                ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_color-mix(in_oklab,var(--accent)_12%,transparent)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 transition-transform",
                                isActive && "scale-110"
                              )}
                            />
                            <span>{item.title}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        )}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center gap-4">
            {isPending ? (
              <div className="flex h-9 w-9 items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : session ? (
              <>
                <MessagesBell />
                <NotificationBell />
                <Dropdown>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    isIconOnly
                  >
                    <UserAvatar
                      imageKey={session?.user?.image || null}
                      name={session?.user?.name || null}
                      email={session?.user?.email || null}
                      size="sm"
                    />
                  </Button>
                  <Dropdown.Popover className="w-56">
                    <Dropdown.Menu
                      onAction={(key) => {
                        if (!session) return;
                        if (key === "profile") {
                          navigate({
                            to: "/profile/$userId",
                            params: { userId: session.user.id },
                          });
                        }
                        if (key === "settings") {
                          navigate({ to: "/dashboard/settings" });
                        }
                        if (key === "logout") {
                          handleSignOut();
                        }
                      }}
                    >
                      <Dropdown.Section>
                        <Dropdown.Item id="account" textValue="Account" isDisabled>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Account
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {session.user.email}
                            </p>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Section>
                      <Dropdown.Section>
                        <Dropdown.Item id="profile" textValue="Profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Dropdown.Item>
                        <Dropdown.Item id="settings" textValue="Settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Dropdown.Item>
                      </Dropdown.Section>
                      <Dropdown.Section>
                        <Dropdown.Item id="logout" textValue="Log out" variant="danger">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Dropdown.Item>
                      </Dropdown.Section>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onPress={() =>
                    navigate({ to: "/sign-in", search: { redirect: undefined } })
                  }
                >
                  Sign In
                </Button>
                <Button
                  onPress={() =>
                    navigate({ to: "/sign-up", search: { redirect: undefined } })
                  }
                >
                  Sign Up
                </Button>
              </>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
