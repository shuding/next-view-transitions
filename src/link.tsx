import NextLink from 'next/link'
import { useTransitionRouter } from './use-transition-router'
import * as React from 'react'

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

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof NextLink>
>((props, ref) => {
  const router = useTransitionRouter();

  const { href, as, replace, scroll } = props;
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href && !as) {
        return;
      }
      if (props.onClick) {
        props.onClick(e);
      }

      if ("startViewTransition" in document) {
        if (shouldPreserveDefault(e)) {
          return;
        }

        e.preventDefault();

        const navigate = replace ? router.replace : router.push;
        navigate((as ?? href).toString(), { scroll: scroll ?? true });
      }
    },
    [props.onClick, href, as, replace, scroll],
  );

  return <NextLink {...props} onClick={onClick} ref={ref} />;
});
Link.displayName = "Link";

export { Link };
