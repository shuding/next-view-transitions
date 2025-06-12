import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export interface TransitionHrefContextValue {
  transitioningHref: string | null
  previousPath: string | null
  setTransitioningHref: (href: string | null) => void
  setPreviousPath: (path: string | null) => void
}

export const ViewTransitionsContext = createContext<
  Dispatch<SetStateAction<(() => void) | null>>
>(() => {})

export const TransitionHrefContext = createContext<TransitionHrefContextValue>({
  transitioningHref: null,
  previousPath: null,
  setTransitioningHref: () => {},
  setPreviousPath: () => {}
})