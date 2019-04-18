import Link from 'next/link'
import { withRouter } from 'next/router'

const Header = ({ router: { pathname } }) => (
  <header>
    <nav>
      <ul>
        <li>
          <Link prefetch href='/'>
            <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
          </Link>
        </li>
        <li>
          <Link prefetch href='/about'>
            <a className={pathname === '/about' ? 'is-active' : ''}>About</a>
          </Link>
        </li>
      </ul>
    </nav>
    <style jsx>{`
      ul {
        list-style-type: none;
        padding-left: 0;
      }
      li {
        display: inline-block;
        margin: 0 .25em;
      }
    `}</style>
  </header>
)

export default withRouter(Header)
