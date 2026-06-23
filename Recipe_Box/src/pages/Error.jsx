import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import './Error.css'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="error-wrapper">
      <div className="error-card">
        <Logo />
        <div className="error-body">
          <p className="error-message">
            Oops, something went wrong! We have captured this error and will work
            diligently on fixing it!
          </p>
          <button className="btn btn-secondary error-home-btn" onClick={() => navigate('/home')}>
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
