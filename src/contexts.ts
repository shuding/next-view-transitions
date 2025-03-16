import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export interface TransitionHrefContextValue {
  transitioningHref: string | null;
  previousPaths: { path: string, timestamp: number }[];
  setTransitioningHref: (href: string | null) => void;
  addPreviousPath: (path: string) => void;
  clearPreviousPath: (path: string) => void;
}

export const ViewTransitionsContext = createContext<
  Dispatch<SetStateAction<(() => void) | null>>
>(() => {})

export const TransitionHrefContext = createContext<TransitionHrefContextValue>({
  transitioningHref: null,
  previousPaths: [],
  setTransitioningHref: () => {},
  addPreviousPath: () => {},
  clearPreviousPath: () => {}
})