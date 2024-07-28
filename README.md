# next-view-transitions

Use [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) in Next.js App Router.

[**Demo**](https://next-view-transitions.vercel.app).

## Disclaimer

This library is aimed at basic use cases of View Transitions and Next.js App Router. With more complex applications and use cases like concurrent rendering, Suspense and streaming, new primitives and APIs still need to be developed into the core of React and Next.js in the future ([more](https://twitter.com/shuding_/status/1779583281920344448)).

## Installation

Use your favorite package manager to install the `next-view-transitions` package. For example:

```bash
pnpm install next-view-transitions
```

## Usage

Wrap your content with the `<ViewTransitions>` component inside the layout file:

```jsx
import { ViewTransitions } from 'next-view-transitions'

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
import { Link } from 'next-view-transitions'

export default function Component() {
  return (
    <div>
      <Link href='/about'>Go to /about</Link>
    </div>
  )
}
```

Or use the `useTransitionRouter` hook for programmatic navigation:

```jsx
import { useTransitionRouter } from 'next-view-transitions'

export default function Component() {
  const router = useTransitionRouter()

  return (
    <div>
      <button onClick={() => {
        // All Next.js router methods are supported
        router.push('/about')
      }}>Go to /about</button>
    </div>
  )
}
```

That's it!

## License

MIT.
