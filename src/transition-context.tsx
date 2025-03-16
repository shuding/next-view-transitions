'use client'

import { use, useCallback, useContext, useEffect, useState } from 'react'
import { useBrowserNativeTransitions } from './browser-native-events'
import { ViewTransitionsContext, TransitionHrefContext } from './contexts'

function BrowserNativeTransitions({ children }: Readonly<{ children: React.ReactNode }>) {
  useBrowserNativeTransitions()
  return children
}

export function ViewTransitions({ children }: Readonly<{ children: React.ReactNode }>) {
  const [finishViewTransition, setFinishViewTransition] = useState<null | (() => void)>(null);
  const [transitioningHref, setTransitioningHref] = useState<string | null>(null);
  const [previousPaths, setPreviousPaths] = useState<{ path: string, timestamp: number }[]>([]);

  const addPreviousPath = useCallback((path: string) => {
    setPreviousPaths(prev => [...prev, { path, timestamp: Date.now() }]);
  }, []);

  const clearPreviousPath = useCallback((path: string) => {
    setPreviousPaths(prev => prev.filter(item => item.path !== path));
  }, []);

  useEffect(() => {
    if (!finishViewTransition) return;
    finishViewTransition();
    setFinishViewTransition(null);
  }, [finishViewTransition]);

  return (
    <ViewTransitionsContext.Provider value={setFinishViewTransition}>
      <TransitionHrefContext.Provider value={{
        transitioningHref,
        setTransitioningHref,
        previousPaths,
        addPreviousPath,
        clearPreviousPath
      }}>
        <BrowserNativeTransitions>
          {children}
        </BrowserNativeTransitions>
      </TransitionHrefContext.Provider>
    </ViewTransitionsContext.Provider>
  );
}

export function useSetFinishViewTransition() {
  return use(ViewTransitionsContext)
}

export type TransitionDirectionOptions = {
  href: string | RegExp;
  direction?: 'in' | 'out' | 'both';
};

export function useTransitionDirection(
  options: TransitionDirectionOptions
): { isEntering: boolean; isExiting: boolean; isTransitioning: boolean } {
  const { href, direction = 'both' } = options;
  
  const isEntering = useTransitionState({
    toHref: href,
  });
  
  const isExiting = useTransitionState({
    fromHref: href,
  });
  
  return {
    isEntering: direction === 'both' || direction === 'in' ? isEntering : false,
    isExiting: direction === 'both' || direction === 'out' ? isExiting : false,
    isTransitioning: isEntering || isExiting
  };
}

type TransitionOptions = {
  fromHref?: string | RegExp
  toHref?: string | RegExp
}

export function useTransitionState(
  hrefOrOptions: string | RegExp | TransitionOptions
): boolean {
  const { transitioningHref, previousPaths } = useContext(TransitionHrefContext);
  
  // Get the most recent path (if any)
  const mostRecentPath = previousPaths.length > 0 
    ? previousPaths.sort((a, b) => b.timestamp - a.timestamp)[0].path 
    : null;

  const checkHrefMatch = (target: string | null, matcher: string | RegExp): boolean => {
    if (!target) return false;
    return typeof matcher === 'string' 
      ? target === matcher
      : matcher.test(target);
  };

  if (typeof hrefOrOptions === 'string' || hrefOrOptions instanceof RegExp) {
    if (!transitioningHref) return false;
    return typeof hrefOrOptions === 'string'
      ? transitioningHref === hrefOrOptions
      : hrefOrOptions.test(transitioningHref);
  }

  const { fromHref, toHref } = hrefOrOptions;
  const hasFrom = fromHref !== undefined;
  const hasTo = toHref !== undefined;

  const fromMatches = hasFrom
    ? checkHrefMatch(mostRecentPath, fromHref)
    : true;

  const toMatches = hasTo
    ? checkHrefMatch(transitioningHref, toHref)
    : true;

  return Boolean(
    (!hasFrom || fromMatches) && 
    (!hasTo || toMatches) && 
    (transitioningHref !== null || !hasTo) &&
    (mostRecentPath !== null || !hasFrom)
  );
}