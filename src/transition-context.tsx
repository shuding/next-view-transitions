import { use, useContext, useEffect, useState } from 'react'
import { useBrowserNativeTransitions } from './browser-native-events'
import { ViewTransitionsContext, TransitionHrefContext } from './contexts'

function BrowserNativeTransitions({ children }: Readonly<{ children: React.ReactNode }>) {
  useBrowserNativeTransitions()
  return children
}

export function ViewTransitions({ children }: Readonly<{
  children: React.ReactNode
}>) {
  const [finishViewTransition, setFinishViewTransition] = useState<null | (() => void)>(null)
  const [transitioningHref, setTransitioningHref] = useState<string | null>(null)

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

export function useSetFinishViewTransition() {
  return use(ViewTransitionsContext)
}

export function useTransitionState(href: string): boolean {
  const { transitioningHref } = useContext(TransitionHrefContext)
  return transitioningHref === href
}
