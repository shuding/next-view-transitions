import { useEffect, useRef, useState, use } from 'react'
import { usePathname } from 'next/navigation'
import { useHash } from './use-hash'
import type { ViewTransitionsOptions } from './transition-context'

// TODO: This implementation might not be complete when there are nested
// Suspense boundaries during a route transition. But it should work fine for
// the most common use cases.

type BrowserNativeTransitionsOptions = Pick<ViewTransitionsOptions, 'scroll'>

const SCROLL_STATE_KEY = '__nvt_scroll'

/** Persists the current scroll offset into the active history entry. */
function saveScrollPosition() {
  history.replaceState(
    { ...history.state, [SCROLL_STATE_KEY]: { x: window.scrollX, y: window.scrollY } },
    ''
  )
}

export function useBrowserNativeTransitions({ scroll }: BrowserNativeTransitionsOptions = {}) {
  const pathname = usePathname()
  const currentPathname = useRef(pathname)

  // This is a global state to keep track of the view transition state.
  const [currentViewTransition, setCurrentViewTransition] = useState<
    | null
    | [
        // Promise to wait for the view transition to start
        Promise<void>,
        // Resolver to finish the view transition
        () => void,
        // Saved scroll position to restore after transition
        { x: number; y: number } | null
      ]
  >(null)

  useEffect(() => {
    if (!('startViewTransition' in document)) {
      return () => {}
    }

    let scrollTimer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(saveScrollPosition, 100)
    }
    if (scroll) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    const onPopState = () => {
      const savedPosition = scroll
        ? history.state?.[SCROLL_STATE_KEY] ?? null
        : null

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
        savedPosition,
      ])
    }
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(scrollTimer)
    }
  }, [])

  if (currentViewTransition && currentPathname.current !== pathname) {
    // Whenever the pathname changes, we block the rendering of the new route
    // until the view transition is started (i.e. DOM screenshotted).
    use(currentViewTransition[0])
  }

  // Keep the transition reference up-to-date.
  const transitionRef = useRef(currentViewTransition)
  useEffect(() => {
    transitionRef.current = currentViewTransition
  }, [currentViewTransition])

  const hash = useHash();

  useEffect(() => {
    // When the new route component is actually mounted, we finish the view
    // transition.
    currentPathname.current = pathname
    if (transitionRef.current) {
      const savedPosition = transitionRef.current[2]
      if (savedPosition) {
        window.scrollTo(savedPosition.x, savedPosition.y)
      }

      transitionRef.current[1]()
      transitionRef.current = null
    }
  }, [hash, pathname]);
}
