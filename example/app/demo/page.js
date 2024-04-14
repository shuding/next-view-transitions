import { Link } from 'next-view-transitions'

export default function Page() {
  return (
    <div className='demo-box'>
      <h2>
        This is the <span className='demo'>Demo</span>
      </h2>
      <p>OK you just saw the demo :)</p>
      <Link href='/'>Go back →</Link>
    </div>
  )
}
