# @qamarq/next-view-transitions

Original Repo: [next-view-transition](https://github.com/shuding/next-view-transitions)
My change: `useRedirect` hook allows manually push new directory to router.

Use [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) in Next.js App Router.

[**Demo**](https://next-view-transitions.vercel.app).

## Disclaimer

This library is aimed at basic use cases of View Transitions and Next.js App Router. With more complex applications and use cases like concurrent rendering, Suspense and streaming, new primitives and APIs still need to be developed into the core of React and Next.js in the future ([more](https://twitter.com/shuding_/status/1779583281920344448)).

## Installation

Use your favorite package manager to install the `next-view-transitions` package. For example:

```bash
pnpm install @qamarq/next-view-transitions
```

## Usage

Wrap your content with the `<ViewTransitions>` component inside the layout file:

```jsx
import { ViewTransitions } from '@qamarq/next-view-transitions'

export default function Layout({ children }) {
  return (
    <ViewTransitions>
      <html lang='en'>
        <body>
          {children}
        </body>
      </html>
    </ViewTransitions>
  )
}
```

Then, use the `<Link>` component for links that need to trigger a view transition:

```jsx
import { Link } from '@qamarq/next-view-transitions'

export default function Component() {
  return (
    <div>
      <Link href='/about'>Go to /about</Link>
    </div>
  )
}
```

## My feature

You can use `useRedirect` hook to manually trigger router push:

```jsx
import { useRedirect } from '@qamarq/next-view-transitions'

export default function Component() {
  const redirect = useRedirect()

  const handleClick = () => {
    redirect('https://example/com')
  }
  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  )
}
```

`redirect` has options:

 - url: string
 - replace: boolean (optional)
 - scroll: boolean (optional)

## Thanks
Many thanks to [shuding](https://github.com/shuding). Amazing work!

## License

MIT.
