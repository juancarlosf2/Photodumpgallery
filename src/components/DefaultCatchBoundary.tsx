import {
  ErrorComponent,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { ButtonLink } from "~/components/ui/link";
import { Button } from "@heroui/react";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const routerState = useRouterState()
  
  const isAuthPage = ['/sign-in', '/sign-up'].includes(routerState.location.pathname)

  console.error('DefaultCatchBoundary triggered:', error)
  console.log('Current route:', routerState.location.pathname)
  console.log('Is auth page:', isAuthPage)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <Button
          onPress={() => {
            router.invalidate()
          }}
          variant="secondary"
          size="sm"
          className="uppercase font-extrabold"
        >
          Try Again
        </Button>
        {isAuthPage ? (
          <ButtonLink
            to="/"
            variant="secondary"
            size="sm"
            className="uppercase font-extrabold"
          >
            Home
          </ButtonLink>
        ) : (
          <ButtonLink
            to="/dashboard"
            variant="secondary"
            size="sm"
            className="uppercase font-extrabold"
          >
            Dashboard
          </ButtonLink>
        )}
      </div>
    </div>
  )
}
