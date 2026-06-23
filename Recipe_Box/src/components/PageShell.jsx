import Logo from './Logo.jsx'
import Nav from './Nav.jsx'
import './PageShell.css'

export default function PageShell({ banner, children, wide = false }) {
  return (
    <div className="page-wrapper">
      <div className={`page-card${wide ? ' page-card--wide' : ''}`}>
        <Logo />
        {banner && <div className="page-banner">{banner}</div>}
        <Nav />
        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  )
}
