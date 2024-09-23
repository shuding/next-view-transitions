import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import { ViewTransitions } from 'next-view-transitions'
import './style.css'

export const metadata = {
  title: 'Next.js View Transitions',
  description: 'Using native CSS View Transitions API in Next.js App Router',
  metadataBase: new URL('https://next-view-transitions.vercel.app'),
}

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang='en' className={GeistSans.variable + ' ' + GeistMono.variable}>
        <body>
          <h1>Next.js View Transitions</h1>
          <p>
            Use{' '}
            <a
              href='https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API'
              target='_blank'
            >
              View Transitions API
            </a>{' '}
            in Next.js App Router.{' '}
            <a
              href='https://github.com/shuding/next-view-transitions'
              target='_blank'
            >
              Source Code ↗
            </a>
          </p>
          <p className='support'>
            <span className='no'>
              ️🔴 Your browser doesn’t support View Transitions.
            </span>
            <span className='yes'>
              ️🟢 Your browser supports View Transitions.
            </span>
          </p>
          <p></p>
          <div className='container'>{children}</div>
          <footer>
            <p>
              Created by{' '}
              <a href='https://twitter.com/shuding_' target='_blank'>
                Shu Ding
              </a>
              . Source code on{' '}
              <a
                href='https://github.com/shuding/next-view-transitions'
                target='_blank'
              >
                GitHub
              </a>
              . Licensed under MIT.
            </p>
          </footer>
        </body>
      </html>
    </ViewTransitions>
  )
}
