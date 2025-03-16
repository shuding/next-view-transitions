import { useEffect, useRef, useState, use, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { useHash } from './use-hash'
import { TransitionHrefContext } from './contexts'

// TODO: This implementation might not be complete when there are nested
// Suspense boundaries during a route transition. But it should work fine for
// the most common use cases.

export function useBrowserNativeTransitions() {
  const pathname = usePathname();
  const currentPathname = useRef(pathname);
  const { setTransitioningHref, setPreviousPath, previousPath } = useContext(TransitionHrefContext)
  const previousPathRef = useRef(previousPath)

  // This is a global state to keep track of the view transition state.
  const [currentViewTransition, setCurrentViewTransition] = useState<
    | null
    | [
        // Promise to wait for the view transition to start
        Promise<void>,
        // Resolver to finish the view transition
        () => void
      ]
  >(null);

  useEffect(() => {
    previousPathRef.current = previousPath
  }, [previousPath])

  useEffect(() => {
    if (!('startViewTransition' in document)) {
      return () => {};
    }
    
    const onPopState = () => {
      const newHref = window.location.pathname + window.location.hash;
      
      const currentPreviousPath = previousPathRef.current

      if (currentPreviousPath !== newHref && currentPreviousPath) {
        setCurrentViewTransition(null)

        return;
      }
      
      setTransitioningHref(newHref);
      
      let pendingViewTransitionResolve: () => void = () => {};

      const pendingViewTransition = new Promise<void>((resolve) => {
        pendingViewTransitionResolve = resolve;
      });
      
      const pendingStartViewTransition = new Promise<void>((resolve) => {
        // @ts-ignore
        document.startViewTransition(() => {
          resolve();
          setPreviousPath(currentPathname.current)
          return pendingViewTransition;
        });
      });
      
      setCurrentViewTransition([
        pendingStartViewTransition,
        pendingViewTransitionResolve!,
      ]);
    };
    
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [setTransitioningHref, setPreviousPath]);
  
  if (currentViewTransition && currentPathname.current !== pathname) {
    // Whenever the pathname changes, we block the rendering of the new route
    // until the view transition is started (i.e. DOM screenshotted).
    use(currentViewTransition[0]);
  }

  // Keep the transition reference up-to-date.
  const transitionRef = useRef(currentViewTransition);
  useEffect(() => {
    transitionRef.current = currentViewTransition;
  }, [currentViewTransition]);

  const hash = useHash();

  useEffect(() => {
    // When the new route component is actually mounted, we finish the view transition.
    currentPathname.current = pathname;
    if (transitionRef.current) {
      transitionRef.current[1]();
      setCurrentViewTransition(null);
      setTransitioningHref(null);
    }
  }, [hash, pathname, setTransitioningHref]);
}