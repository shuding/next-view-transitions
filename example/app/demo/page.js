'use client'

import { Link, useTransitionRouter } from 'next-view-transitions'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const router = useTransitionRouter()
  const search = useSearchParams()

  return (
    <div className='demo-box'>
      <h2>
        This is the <span className='demo'>demo</span>
      </h2>
      <p>OK you just saw the demo :)</p>
      <p>Current query params: {search}</p>
      <div className='demo-link-box'>
        <a
          href='/'
          onClick={(e) => {
            e.preventDefault()
            router.back()
          }}
        >
          ← Back to homepage
        </a>
        <Link href='/demo?query=test2'>Test query param only change</Link>
      </div>
    </div>
  )
}
