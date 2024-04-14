import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback } from 'react'
import { useSetFinishViewTransition } from './transition-context'

// This is a wrapper around next/link that explicitly uses the router APIs
// to navigate, and trigger a view transition.

export function Link(props: React.ComponentProps<typeof NextLink>) {
  const router = useRouter()
  const finishViewTransition = useSetFinishViewTransition()

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (props.onClick) {
        props.onClick(e)
      }

      if ('startViewTransition' in document) {
        e.preventDefault()

        // @ts-ignore
        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              startTransition(() => {
                router.push(props.href)
                finishViewTransition(() => resolve)
              })
            })
        )
      }
    },
    [props.href, props.onClick]
  )

  return <NextLink {...props} onClick={onClick} />
}
