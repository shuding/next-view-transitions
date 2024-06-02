import { Link } from 'next-view-transitions'

export default function Page() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href='#demo'>Demo</Link>
          </li>
          <li>
            <Link href='#disclaimer'>Disclaimer</Link>
          </li>
          <li>
            <Link href='#installation'>Installation</Link>
          </li>
          <li>
            <Link href='#usage'>Usage</Link>
          </li>
        </ul>
      </nav>
      <h2>
        <span id='demo' className='demo'>Demo</span>
      </h2>
      <p>
        <Link href='/demo'>Go to /demo →</Link>
      </p>
      <h2 id='disclaimer'>Disclaimer</h2>
      <p>
        This library is aimed at basic use cases of View Transitions and Next.js
        App Router. With more complex applications and use cases like concurrent
        rendering, Suspense and streaming, new primitives and APIs still need to
        be developed into the core of React and Next.js in the future (
        <a
          href='https://twitter.com/shuding_/status/1779583281920344448'
          target='_blank'
        >
          more
        </a>
        ).
      </p>
      <h2 id='installation'>Installation</h2>
      <p>
        Use your favorite package manager to install the{' '}
        <code>next-view-transitions</code> package:
      </p>
      <p>
        <code>pnpm install next-view-transitions</code>
      </p>
      <h2 id='usage'>Usage</h2>
      <p>
        Wrap your content with the <code>&lt;ViewTransitions&gt;</code>{' '}
        component inside the layout file:
      </p>
      <pre>
        <code>
          {`\
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
}`}
        </code>
      </pre>
      <p>
        Then, use the <code>&lt;Link&gt;</code> component for links that need to
        trigger a view transition:
      </p>
      <pre>
        <code>
          {`\
import { Link } from 'next-view-transitions'

export default function Component() {
  return (
    <div>
      <Link href='/about'>Go to /about</Link>
    </div>
  )
}`}
        </code>
      </pre>
      <p>That’s it!</p>
    </div>
  )
}
