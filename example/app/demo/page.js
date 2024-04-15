import { Link } from 'next-view-transitions'

export default async function Page() {
  const data = Math.random()
  await new Promise(r => setTimeout(5000))

  return (
    <div className='demo-box'>
      <h2>
        This is the <span className='demo'>Demo</span>
      </h2>
      <p>OK you just saw the demo :) {data}</p>
      <Link href='/'>Go back →</Link>
    </div>
  )
}

export const dynamic = 'force-dynamic'
