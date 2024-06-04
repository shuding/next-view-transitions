'use client'

import { Link, useTransitionRouter } from 'next-view-transitions'
import { useState } from "react";

export default function Page() {
  const [withCustomTransition, setWithCustomTransition] = useState(false)
  const router = useTransitionRouter();

  const routerNavigate = () => {
    router.push('/demo', {
        onTransitionReady: withCustomTransition ? slideInOut: undefined,
    });
  }

  return (
    <div>
      <h2>
        <span className='demo'>Demo</span>
      </h2>
        <p>
            <Link href='/demo'>Go to /demo →</Link>
        </p>
        <p>
            <a onClick={routerNavigate}>Go to /demo with router.push →</a>
        </p>
        <p>
            <label>
                <input type="checkbox" onChange={() => setWithCustomTransition((prev) => !prev)}/>{' '}
                custom transition
            </label>
        </p>
        <h2>Disclaimer</h2>
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
      <h2>Installation</h2>
      <p>
        Use your favorite package manager to install the{' '}
        <code>next-view-transitions</code> package:
      </p>
      <p>
        <code>pnpm install next-view-transitions</code>
      </p>
      <h2>Usage</h2>
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

function slideInOut() {
    document.documentElement.animate(
        [
            {
                opacity: 1,
                transform: 'translate(0, 0)',
            },
            {
                opacity: 0,
                transform: 'translate(-100%, 0)',
            },
        ],
        {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'forwards',
            pseudoElement: '::view-transition-old(root)',
        }
    );

    document.documentElement.animate(
        [
            {
                opacity: 0,
                transform: 'translate(100%, 0)',
            },
            {
                opacity: 1,
                transform: 'translate(0, 0)',
            },
        ],
        {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
        }
    );
}

