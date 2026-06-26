import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'
import './Auth.css'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, login } = useApp()

  const [mode, setMode] = useState(location.state?.mode ?? 'signup')
  const [error, setError] = useState('')
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const [signupForm, setSignupForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '',
  })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    const { firstName, lastName, username, email, password } = signupForm
    if (!firstName || !lastName || !username || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      const result = await register({ firstName, lastName, username, email, password })
      if (result.needsConfirmation) {
        setAwaitingConfirmation(true)
        return
      }
      navigate('/home')
    } catch (err) {
      setError(err.message ?? 'Registration failed. Please try again.')
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const { email, password } = loginForm
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    const ok = await login(email, password)
    if (ok) {
      navigate('/home')
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setAwaitingConfirmation(false)
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  if (awaitingConfirmation) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <Logo />
          <div className="auth-body">
            <p className="auth-confirmation-msg">
              Check your email and click the confirmation link to activate your account, then{' '}
              <button type="button" className="auth-toggle-btn" onClick={() => switchMode('login')}>
                log in
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo />
        <div className="auth-body">
          {error && <div className="error-banner auth-error">{error}</div>}

          {mode === 'signup' ? (
            <form className="auth-form" onSubmit={handleSignup} noValidate>
              <input
                type="text"
                placeholder="first_name"
                value={signupForm.firstName}
                onChange={e => setSignupForm(f => ({ ...f, firstName: e.target.value }))}
              />
              <input
                type="text"
                placeholder="last_name"
                value={signupForm.lastName}
                onChange={e => setSignupForm(f => ({ ...f, lastName: e.target.value }))}
              />
              <input
                type="text"
                placeholder="username"
                value={signupForm.username}
                onChange={e => setSignupForm(f => ({ ...f, username: e.target.value }))}
              />
              <input
                type="email"
                placeholder="email"
                value={signupForm.email}
                onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
              />
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  value={signupForm.password}
                  onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="auth-footer">
                <span className="auth-toggle">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')}>Log in</button>
                </span>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <input
                type="email"
                placeholder="email"
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                type="password"
                placeholder="password"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
              />
              <div className="auth-footer">
                <span className="auth-toggle">
                  New here?{' '}
                  <button type="button" onClick={() => switchMode('signup')}>Sign up</button>
                </span>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
