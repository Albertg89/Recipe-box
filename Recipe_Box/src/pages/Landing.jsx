import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-wrapper">
      <div className="landing-card">
        <Logo />
        <div className="landing-body">
          <div className="landing-intro">
            <p>
              Welcome to <strong>Recipe Box</strong> — your warm, personal kitchen companion.
              Discover new recipes from around the world, save your favorites for later,
              and keep all your original creations in one tidy place.
            </p>
            <p>
              Ready to start cooking? Create a free account to get started, or log in if
              you've been here before. Your next great meal is just a few clicks away.
            </p>
          </div>
          <div className="landing-cta-row">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth')}
            >
              Get started!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
