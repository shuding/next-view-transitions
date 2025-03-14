import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'


/**
 *Context for tracking the currently transitioning href
 */
export interface TransitionHrefContextValue {
  transitioningHref: string | null
  setTransitioningHref: (href: string | null) => void
}

/**
 * Context for managing view transition completion callbacks
 */
export const ViewTransitionsContext = createContext<
  Dispatch<SetStateAction<(() => void) | null>>
>(() => {})

export const TransitionHrefContext = createContext<TransitionHrefContextValue>({
  transitioningHref: null,
  setTransitioningHref: () => {}
})