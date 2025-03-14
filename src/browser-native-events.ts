import { useEffect, useRef, useState, use, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { useHash } from './use-hash'
import { TransitionHrefContext } from './contexts'

/**
 * Hook that implements browser native view transitions
 * 
 * This hooks into the browser's View Transition API to provide smooth
 * transitions between route changes.
 * 
 * Note: This implementation might not be complete when there are nested
 * Suspense boundaries during a route transition. But it should work fine for
 * the most common use cases.
 */
export function useBrowserNativeTransitions() {
  const pathname = usePathname()
  const currentPathname = useRef(pathname)
  const { setTransitioningHref } = useContext(TransitionHrefContext)
  const hash = useHash()
  
  // Tuple type for view transition state: [startPromise, resolveFunction]
  type ViewTransitionState = [Promise<void>, () => void] | null
  
  // Global state to track the current view transition
  const [currentViewTransition, setCurrentViewTransition] = 
    useState<ViewTransitionState>(null)
  
  // Keep a persistent reference to the transition state
  const transitionRef = useRef(currentViewTransition)
  
  // Update the ref whenever the state changes
  useEffect(() => {
    transitionRef.current = currentViewTransition
  }, [currentViewTransition])
  
  // Set up popstate listener for navigation events
  useEffect(() => {
    // Skip if browser doesn't support View Transitions API
    if (!('startViewTransition' in document)) {
      return () => {}
    }
    
    const onPopState = () => {
      const newHref = window.location.pathname + window.location.hash
      
      // Set transitioning href early to ensure proper state tracking
      setTransitioningHref(newHref)
      
      // Create a promise that will resolve when we're ready to complete the transition
      let pendingViewTransitionResolve: () => void = () => {}
      const pendingViewTransition = new Promise<void>((resolve) => {
        pendingViewTransitionResolve = resolve
      })
      
      // Start the view transition and capture the DOM state
      const pendingStartViewTransition = new Promise<void>((resolve) => {
        // @ts-ignore - The View Transition API types might not be available
        document.startViewTransition(() => {
          resolve()
          return pendingViewTransition
        })
      })
      
      // Update state with promises needed to control the transition
      setCurrentViewTransition([
        pendingStartViewTransition,
        pendingViewTransitionResolve,
      ])
    }
    
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [setTransitioningHref])
  
  // Block rendering until view transition starts
  if (currentViewTransition && currentPathname.current !== pathname) {
    use(currentViewTransition[0])
  }
  
  // Complete the transition when the new route is mounted
  useEffect(() => {
    currentPathname.current = pathname
    
    if (transitionRef.current) {
      transitionRef.current[1]()
      setCurrentViewTransition(null)
      setTransitioningHref(null)
    }
  }, [hash, pathname, setTransitioningHref])
}