import { Breadcrumbs } from "@heroui/react";
import { createLink, type LinkComponent } from "@tanstack/react-router";

const CreatedBreadcrumbItem = createLink(Breadcrumbs.Item);

export const BreadcrumbItem: LinkComponent<typeof Breadcrumbs.Item> = (props) => {
  return <CreatedBreadcrumbItem preload="intent" {...props} />;
};
