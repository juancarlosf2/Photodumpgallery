import { Moon, Sun } from "lucide-react";

import { Button, Dropdown } from "@heroui/react";
import { useTheme } from "~/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <Button variant="outline" isIconOnly>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Dropdown.Popover placement="bottom">
        <Dropdown.Menu
          onAction={(key) => setTheme(key as "light" | "dark" | "system")}
        >
          <Dropdown.Item id="light" textValue="Light">
            Light
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue="Dark">
            Dark
          </Dropdown.Item>
          <Dropdown.Item id="system" textValue="System">
            System
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
