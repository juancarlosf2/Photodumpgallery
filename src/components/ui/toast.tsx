import { Toast } from "@heroui/react";

type ToasterProps = React.ComponentProps<typeof Toast.Provider>;

const Toaster = ({
  placement = "bottom end",
  maxVisibleToasts = 4,
  ...props
}: ToasterProps) => {
  return (
    <Toast.Provider
      placement={placement}
      maxVisibleToasts={maxVisibleToasts}
      {...props}
    />
  );
};

export { Toaster };
