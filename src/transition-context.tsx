import type { Dispatch, SetStateAction } from 'react'
import { createContext, use, useEffect, useState } from 'react'

import { useBrowserNativeTransitions } from './browser-native-events'

const ViewTransitionsContext = createContext<
  Dispatch<SetStateAction<(() => void) | null>>
>(null)

export function ViewTransitions({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [finishViewTransition, setFinishViewTransition] = useState<
    null | (() => void)
  >(null)

  useEffect(() => {
    if (finishViewTransition) {
      finishViewTransition()
      setFinishViewTransition(null)
    }
  }, [finishViewTransition])

  useBrowserNativeTransitions()

  return (
    <ViewTransitionsContext.Provider value={setFinishViewTransition}>
      {children}
    </ViewTransitionsContext.Provider>
  )
}

export function useSetFinishViewTransition() {
  const context = use(ViewTransitionsContext)

  if (!context) {
    throw new Error(
      'useSetFinishViewTransition must be used within a ViewTransitions component',
    )
  }

  return context
}
