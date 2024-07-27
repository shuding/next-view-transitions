import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// TODO: This implementation might not be complete when there are nested
// Suspense boundaries during a route transition. But it should work fine for
// the most common use cases.

export function useBrowserNativeTransitions() {
  const pathname = usePathname()
  const currentPathname = useRef(pathname)

  // This is a global state to keep track of the view transition state.
  const [currentViewTransition, setCurrentViewTransition] = useState<
    | null
    | [
        // Promise to wait for the view transition to start
        Promise<void>,
        // Resolver to finish the view transition
        () => void
      ]
  >(null)

  useEffect(() => {
    if (!('startViewTransition' in document)) {
      return () => {}
    }

    const onPopState = () => {
      let pendingViewTransitionResolve: () => void

      const pendingViewTransition = new Promise<void>((resolve) => {
        pendingViewTransitionResolve = resolve
      })

      const pendingStartViewTransition = new Promise<void>((resolve) => {
        // @ts-ignore
        document.startViewTransition(() => {
          resolve()
          return pendingViewTransition
        })
      })

      setCurrentViewTransition([
        pendingStartViewTransition,
        pendingViewTransitionResolve!,
      ])
    }
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    if (currentViewTransition && currentPathname.current !== pathname) {
      // Wait for the view transition to start before rendering the new route
      currentViewTransition[0].then(() => {
        currentPathname.current = pathname
      })
    }
  }, [currentViewTransition, pathname])

  // Keep the transition reference up-to-date.
  const transitionRef = useRef(currentViewTransition)
  useEffect(() => {
    transitionRef.current = currentViewTransition
  }, [currentViewTransition])

  useEffect(() => {
    // When the new route component is actually mounted, we finish the view
    // transition.
    if (transitionRef.current) {
      transitionRef.current[1]()
      transitionRef.current = null
    }
  }, [pathname])
}
