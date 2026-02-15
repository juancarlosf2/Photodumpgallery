import { Breadcrumbs } from "@heroui/react";
import type {
  LinkComponentProps,
  RegisteredRouter,
} from "@tanstack/react-router";
import { BreadcrumbItem } from "~/components/ui/breadcrumbs";
import { Link } from "./ui/link";

type RouterBreadcrumbLinkOptions = Omit<
  LinkComponentProps<typeof BreadcrumbItem, RegisteredRouter, string, string>,
  "children" | "className"
>;

type InternalBreadcrumbEntry = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  to: RouterBreadcrumbLinkOptions["to"];
  href?: never;
} & Omit<RouterBreadcrumbLinkOptions, "to" | "href">;

type ExternalBreadcrumbEntry = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  target?: string;
  rel?: string;
  to?: never;
  params?: never;
  search?: never;
  hash?: never;
};

type CurrentBreadcrumbEntry = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  to?: never;
  href?: never;
  params?: never;
  search?: never;
  hash?: never;
};

type BreadcrumbEntry =
  | InternalBreadcrumbEntry
  | ExternalBreadcrumbEntry
  | CurrentBreadcrumbEntry;

interface AppBreadcrumbProps {
  items: readonly BreadcrumbEntry[];
}

function isInternalBreadcrumbEntry(
  item: BreadcrumbEntry,
): item is InternalBreadcrumbEntry {
  return "to" in item;
}

function isExternalBreadcrumbEntry(
  item: BreadcrumbEntry,
): item is ExternalBreadcrumbEntry {
  return "href" in item;
}

export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const content = (
          <span className="inline-flex group-data-[current=true]:text-foreground group-data-[current=true]:opacity-50 items-center gap-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.label}
          </span>
        );

        if (!isLast && isInternalBreadcrumbEntry(item)) {
          return (
            <BreadcrumbItem
              key={`${item.label}-${index}`}
              to={item.to}
              params={item.params}
              search={item.search}
              hash={item.hash}
              state={item.state}
              from={item.from}
              mask={item.mask}
              replace={item.replace}
              resetScroll={item.resetScroll}
              viewTransition={item.viewTransition}
              startTransition={item.startTransition}
              preload={item.preload}
              preloadDelay={item.preloadDelay}
              activeOptions={
                item.activeOptions ?? {
                  exact: true,
                  includeSearch: false,
                  includeHash: false,
                }
              }
              activeProps={item.activeProps}
              inactiveProps={item.inactiveProps}
              disabled={item.disabled}
              target={item.target}
              rel={item.rel}
              reloadDocument={item.reloadDocument}
              ignoreBlocker={item.ignoreBlocker}
            >
              <Link
                to={item.to}
                params={item.params}
                search={item.search}
                hash={item.hash}
                state={item.state}
                from={item.from}
                mask={item.mask}
                replace={item.replace}
                resetScroll={item.resetScroll}
                viewTransition={item.viewTransition}
                startTransition={item.startTransition}
                preload={item.preload}
                preloadDelay={item.preloadDelay}
                activeOptions={
                  item.activeOptions ?? {
                    exact: true,
                    includeSearch: false,
                    includeHash: false,
                  }
                }
                disabled={item.disabled}
                target={item.target}
                rel={item.rel}
                reloadDocument={item.reloadDocument}
                ignoreBlocker={item.ignoreBlocker}
              >
                {content}
              </Link>
            </BreadcrumbItem>
          );
        }

        if (!isLast && isExternalBreadcrumbEntry(item)) {
          return (
            <Breadcrumbs.Item
              key={`${item.label}-${index}`}
              href={item.href}
              target={item.target}
              rel={item.rel}
            >
              {content}
            </Breadcrumbs.Item>
          );
        }

        return (
          <Breadcrumbs.Item
            className="text-muted group"
            key={`${item.label}-${index}`}
          >
            {content}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}
