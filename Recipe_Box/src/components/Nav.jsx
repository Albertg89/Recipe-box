import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import './Nav.css'

export default function Nav() {
  const { logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/auth', { state: { mode: 'login' } })
  }

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`

  return (
    <nav className="main-nav">
      <NavLink to="/home"          className={linkClass}>Home</NavLink>
      <NavLink to="/browse"        className={linkClass}>Browse</NavLink>
      <NavLink to="/favorites"     className={linkClass}>Favorites</NavLink>
      <NavLink to="/my-recipes"    className={linkClass}>My Recipes</NavLink>
      <NavLink to="/profile"       className={linkClass}>Profile</NavLink>
      <NavLink to="/contact"       className={linkClass}>Contact</NavLink>
      <button  onClick={handleLogout} className="nav-link nav-link--logout">Logout</button>
    </nav>
  )
}
