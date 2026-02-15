import { ButtonLink } from "~/components/ui/link";
import { Button } from "@heroui/react";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <Button
          onPress={() => window.history.back()}
          variant="secondary"
          size="sm"
          className="uppercase font-black"
        >
          Go back
        </Button>
        <ButtonLink
          to="/"
          variant="secondary"
          size="sm"
          className="uppercase font-black"
        >
          Start Over
        </ButtonLink>
      </p>
    </div>
  )
}
