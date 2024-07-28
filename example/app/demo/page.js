'use client'

import { useTransitionRouter } from 'next-view-transitions'

export default function Page() {
  const router = useTransitionRouter()
  return (
    <div className='demo-box'>
      <h2>
        This is the <span className='demo'>demo</span>
      </h2>
      <p>OK you just saw the demo :)</p>
      <a
        href='/'
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        ← Back to homepage
      </a>
    </div>
  )
}
