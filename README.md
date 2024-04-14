# next-view-transitions

Use [CSS View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) in Next.js App Router.

[**Demo**](https://next-view-transitions.vercel.app).

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

That's it!

## License

MIT.
