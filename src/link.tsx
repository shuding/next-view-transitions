import NextLink from 'next/link'
import { useTransitionRouter } from './use-transition-router'
import { useCallback } from 'react'

/**
 * Determines if a click event was modified (e.g., with meta key or ctrl key)
 * 
 * @param event - The mouse event to check
 * @returns Whether the event was modified
 */
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement
  const target = eventTarget.getAttribute('target')
  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  )
}

/**
 * Determines if the browser's default behavior should be preserved for a click event
 * 
 * @param e - The mouse event to check
 * @returns Whether the default behavior should be preserved
 */
function shouldPreserveDefault(e: React.MouseEvent<HTMLAnchorElement>): boolean {
  const { nodeName } = e.currentTarget

  // anchors inside an svg have a lowercase nodeName
  const isAnchorNodeName = nodeName.toUpperCase() === 'A'

  return isAnchorNodeName && isModifiedEvent(e)
}

/**
 * Extended Link component that supports view transitions
 * 
 * This component wraps Next.js Link and adds support for the View Transitions API
 * when navigating between pages.
 */
export function Link(props: React.ComponentProps<typeof NextLink>) {
  const router = useTransitionRouter()
  const { href, as, replace, scroll, onClick: userOnClick, ...restProps } = props

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call the user's onClick handler if provided
      if (userOnClick) {
        userOnClick(e)
      }

      // Only use view transitions if the browser supports it
      if ('startViewTransition' in document) {
        // Don't override default behavior for modified clicks
        if (shouldPreserveDefault(e)) {
          return
        }

        // Prevent default behavior to handle navigation ourselves
        e.preventDefault()

        // Use the appropriate navigation method based on the replace prop
        const navigate = replace ? router.replace : router.push
        navigate(as || href, { scroll: scroll ?? true })
      }
    },
    [userOnClick, href, as, replace, scroll, router]
  )

  return <NextLink {...restProps} href={href} as={as} replace={replace} scroll={scroll} onClick={onClick} />
}