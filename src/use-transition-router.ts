// use-transition-router.ts
import { useRouter as useNextRouter } from 'next/navigation'
import { startTransition, useCallback, useContext, useMemo } from "react"
import { TransitionHrefContext } from "./contexts"
import {
  AppRouterInstance,
  NavigateOptions
} from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useSetFinishViewTransition } from './transition-context'

export type TransitionOptions = {
  onTransitionReady?: () => void
}

type NavigateOptionsWithTransition = NavigateOptions & TransitionOptions

export type TransitionRouter = AppRouterInstance & {
  push: (href: string, options?: NavigateOptionsWithTransition) => void
  replace: (href: string, options?: NavigateOptionsWithTransition) => void
}

export function useTransitionRouter(): TransitionRouter {
  const router = useNextRouter()
  const finishViewTransition = useSetFinishViewTransition()
  const { setTransitioningHref, setPreviousPath } = useContext(TransitionHrefContext)

  const triggerTransition = useCallback((
    href: string, 
    cb: () => void, 
    { onTransitionReady }: TransitionOptions = {}
  ) => {
    const currentPath = window.location.pathname
    setTransitioningHref(href)
    setPreviousPath(currentPath)

    if ('startViewTransition' in document) {
      // @ts-ignore
      const transition = document.startViewTransition(() => 
        new Promise<void>((resolve) => {
          startTransition(() => {
            cb()
            finishViewTransition(() => resolve)
          })
        })
      )

      transition.finished.finally(() => {
        setTransitioningHref(null)
      })

      if (onTransitionReady) {
        transition.ready.then(onTransitionReady)
      }
    } else {
      setTransitioningHref(null)
      return cb()
    }
  }, [setTransitioningHref, setPreviousPath, finishViewTransition])

  const push = useCallback(
    (href: string, { onTransitionReady, ...options }: NavigateOptionsWithTransition = {}) => {
      triggerTransition(href, () => router.push(href, options), { onTransitionReady })
    },
    [triggerTransition, router]
  )

  const replace = useCallback(
    (href: string, { onTransitionReady, ...options }: NavigateOptionsWithTransition = {}) => {
      triggerTransition(href, () => router.replace(href, options), { onTransitionReady })
    },
    [triggerTransition, router]
  )

  return useMemo<TransitionRouter>(
    () => ({
      ...router,
      push,
      replace,
    }),
    [push, replace, router]
  )
}