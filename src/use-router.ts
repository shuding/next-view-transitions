import { useRouter as useNextRouter } from 'next/navigation'
import { startTransition, useCallback } from "react";
import { useSetFinishViewTransition } from "./transition-context";

export function useRouter() {
  const router = useNextRouter()
  const finishViewTransition = useSetFinishViewTransition()

  const callback = useCallback((cb: () => void) => {
    // @ts-ignore
    document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          startTransition(() => {
            cb();
            finishViewTransition(() => resolve)
          })
        })
    )
  }, [])

  const push = useCallback((...args: Parameters<typeof router.push>) => {
    callback(() => router.push(...args))
  }, [callback, router])

  const replace = useCallback((...args: Parameters<typeof router.replace>) => {
    callback(() => router.replace(...args))
  }, [callback, router]);

  return {
    ...router,
    push,
    replace,
  }
}