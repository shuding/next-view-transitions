import { use, useContext, useEffect, useState } from 'react'
import { useBrowserNativeTransitions } from './browser-native-events'
import { ViewTransitionsContext, TransitionHrefContext } from './contexts'

/**
 * Internal component that initializes browser native transition handlers
 */
function BrowserNativeTransitions({ children }: Readonly<{ children: React.ReactNode }>) {
  useBrowserNativeTransitions()
  return children
}
/**
 * Provider component that manages view transitions state
 */
export function ViewTransitions({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const [finishViewTransition, setFinishViewTransition] = useState<null | (() => void)>(null)
  const [transitioningHref, setTransitioningHref] = useState<string | null>(null)

  // Execute and clear transition completion callback when available
  useEffect(() => {
    if (!finishViewTransition) return
    finishViewTransition()
    setFinishViewTransition(null)
  }, [finishViewTransition])


  return (
    <ViewTransitionsContext.Provider value={setFinishViewTransition}>
      <TransitionHrefContext.Provider value={{ transitioningHref, setTransitioningHref }}>
        <BrowserNativeTransitions>
          {children}
        </BrowserNativeTransitions>
      </TransitionHrefContext.Provider>
    </ViewTransitionsContext.Provider>
  )
}

/**
 * Hook to access the function for completing view transitions
 */
export function useSetFinishViewTransition() {
  return use(ViewTransitionsContext)
}

/**
 * Hook to determine if a specific URL is currently transitioning
 * 
 * @param href - The URL to check
 * @returns True if this URL is currently in transition
 */
export function useTransitionState(href: string): boolean {
  const { transitioningHref } = useContext(TransitionHrefContext)
  return transitioningHref === href
}
