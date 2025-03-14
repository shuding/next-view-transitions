import { useRouter as useNextRouter } from 'next/navigation'
import { startTransition, useCallback, useContext, useMemo } from "react"
import { TransitionHrefContext } from "./contexts"
import {
  AppRouterInstance,
  NavigateOptions
} from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useSetFinishViewTransition } from './transition-context'

/**
 * Additional options for transitions
 */
export type TransitionOptions = {
  /**
   * Callback fired when the transition is ready (DOM has been captured)
   */
  onTransitionReady?: () => void
}

/**
 * Combined navigation options with transition-specific options
 */
type NavigateOptionsWithTransition = NavigateOptions & TransitionOptions

/**
 * Extended router interface with transition-aware navigation methods
 */
export type TransitionRouter = AppRouterInstance & {
  /**
   * Push a new URL with view transition support
   */
  push: (href: string, options?: NavigateOptionsWithTransition) => void
  /**
   * Replace current URL with view transition support
   */
  replace: (href: string, options?: NavigateOptionsWithTransition) => void
}

/**
 * Hook that provides a router enhanced with view transition capabilities
 * 
 * @returns A router instance with transition-aware navigation methods
 */
export function useTransitionRouter(): TransitionRouter {
  const router = useNextRouter()
  const finishViewTransition = useSetFinishViewTransition()
  const { setTransitioningHref } = useContext(TransitionHrefContext)

  /**
   * Trigger a view transition for a navigation action
   * 
   * @param href - The URL to navigate to
   * @param cb - The navigation callback to execute
   * @param options - Additional transition options
   */
  const triggerTransition = useCallback((
    href: string, 
    cb: () => void, 
    { onTransitionReady }: TransitionOptions = {}
  ) => {
    // Set the href being transitioned to for tracking
    setTransitioningHref(href)

    // Use View Transitions API if supported
    if ('startViewTransition' in document) {
      // @ts-ignore - View Transitions API may not be typed
      const transition = document.startViewTransition(() => 
        new Promise<void>((resolve) => {
          startTransition(() => {
            // Execute the navigation
            cb()
            // Signal when the transition can finish
            finishViewTransition(() => resolve)
          })
        })
      )

      // Clean up when the transition is complete
      transition.finished.finally(() => {
        setTransitioningHref(null)
      })

      // Call the ready callback if provided
      if (onTransitionReady) {
        transition.ready.then(onTransitionReady)
      }
    } else {
      // Fallback for browsers without View Transitions support
      setTransitioningHref(null)
      return cb()
    }
  }, [setTransitioningHref, finishViewTransition])

  /**
   * Enhanced push navigation with view transition support
   */
  const push = useCallback(
    (href: string, { onTransitionReady, ...options }: NavigateOptionsWithTransition = {}) => {
      triggerTransition(href, () => router.push(href, options), { onTransitionReady })
    },
    [triggerTransition, router]
  )

  /**
   * Enhanced replace navigation with view transition support
   */
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