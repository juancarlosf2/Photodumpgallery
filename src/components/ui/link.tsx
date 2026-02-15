import * as React from "react";
import { Link as HeroLink } from "@heroui/react";
import { buttonVariants, type ButtonVariants } from "@heroui/styles";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

const HeroLinkAnchor = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof HeroLink>
>((props, ref) => {
  return <HeroLink ref={ref} {...props} />;
});
HeroLinkAnchor.displayName = "HeroLinkAnchor";

const CreatedLink = createLink(HeroLinkAnchor);
export const Link: LinkComponent<typeof HeroLinkAnchor> = (props) => {
  return <CreatedLink preload="intent" {...props} />;
};

type ButtonLinkAnchorProps = Omit<React.ComponentPropsWithoutRef<"a">, "className"> &
  ButtonVariants & {
    className?: string;
  };

const ButtonLinkAnchor = React.forwardRef<HTMLAnchorElement, ButtonLinkAnchorProps>(
  (
    { className, variant = "primary", size = "md", isIconOnly, fullWidth, ...props },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, isIconOnly, fullWidth }),
          className
        )}
        {...props}
      />
    );
  }
);
ButtonLinkAnchor.displayName = "ButtonLinkAnchor";

const CreatedButtonLink = createLink(ButtonLinkAnchor);
export const ButtonLink: LinkComponent<typeof ButtonLinkAnchor> = (props) => {
  return <CreatedButtonLink preload="intent" {...props} />;
};
