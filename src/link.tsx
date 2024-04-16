import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback } from 'react'
import { useSetFinishViewTransition } from './transition-context'

// copied from https://github.com/vercel/next.js/blob/66f8ffaa7a834f6591a12517618dce1fd69784f6/packages/next/src/client/link.tsx#L180-L191
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

// copied from https://github.com/vercel/next.js/blob/66f8ffaa7a834f6591a12517618dce1fd69784f6/packages/next/src/client/link.tsx#L204-L217
function shouldPreserveDefault(
  e: React.MouseEvent<HTMLAnchorElement>
): boolean {
  const { nodeName } = e.currentTarget

  // anchors inside an svg have a lowercase nodeName
  const isAnchorNodeName = nodeName.toUpperCase() === 'A'

  if (isAnchorNodeName && isModifiedEvent(e)) {
    // ignore click for browser’s default behavior
    return true
  }

  return false
}

// This is a wrapper around next/link that explicitly uses the router APIs
// to navigate, and trigger a view transition.

export function Link(props: React.ComponentProps<typeof NextLink>) {
  const router = useRouter()
  const finishViewTransition = useSetFinishViewTransition()

  const { href, as, replace, scroll } = props
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (shouldPreserveDefault(e)) {
        return
      }

      if (props.onClick) {
        props.onClick(e)
      }

      e.preventDefault()

      // extended from https://github.com/vercel/next.js/blob/66f8ffaa7a834f6591a12517618dce1fd69784f6/packages/next/src/client/link.tsx#L221-L235
      // removed the need for pages router support
      const navigate = () => {
        router[replace ? 'replace' : 'push'](as || href, {
          scroll: scroll ?? true,
        })
      }

      if ('startViewTransition' in document) {
        // @ts-ignore
        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              startTransition(() => {
                navigate()
                finishViewTransition(() => resolve)
              })
            })
        )

        return
      }

      startTransition(navigate)
    },
    [props.onClick, href, as, replace, scroll]
  )

  return <NextLink {...props} onClick={onClick} />
}
