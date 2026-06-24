import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import PageShell from '../components/PageShell.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const { user, myRecipes, updateProfile, deleteAccount, loading } = useApp()

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    password:  '',
  })
  const [saveMessage, setSaveMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setSaveMessage('')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setSaveMessage('error:Please fill in all required fields.')
      return
    }
    const updates = {
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
      email:     form.email.trim(),
    }
    if (form.password.trim()) {
      updates.password = form.password.trim()
    }
    try {
      await updateProfile(updates)
      setForm(f => ({ ...f, password: '' }))
      setSaveMessage('ok:Your profile has been updated.')
    } catch {
      setSaveMessage('error:Could not save changes. Please try again.')
    }
  }

  function handleDeleteConfirm() {
    deleteAccount()
    navigate('/auth')
  }

  const isError = saveMessage.startsWith('error:')
  const messageText = saveMessage.replace(/^(ok|error):/, '')

  return (
    <PageShell banner="Your Profile">
      <form className="profile-form" onSubmit={handleSave} noValidate>

        <section className="profile-section">
          <h3 className="profile-section-label">Personal Information:</h3>
          <div className="profile-fields">
            <input
              type="text"
              placeholder="first_name"
              value={form.firstName}
              onChange={e => set('firstName', e.target.value)}
            />
            <input
              type="text"
              placeholder="last_name"
              value={form.lastName}
              onChange={e => set('lastName', e.target.value)}
            />
            <input
              type="email"
              placeholder="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
            <input
              type="password"
              placeholder="password (leave blank to keep current)"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
          </div>

          {saveMessage && (
            <p className={`profile-message ${isError ? 'profile-message--error' : 'profile-message--ok'}`}>
              {messageText}
            </p>
          )}
        </section>

        {myRecipes.length > 0 && (
          <section className="profile-section">
            <h3 className="profile-section-label">List of original recipes:</h3>
            <ul className="profile-recipes-list">
              {myRecipes.map(recipe => (
                <li key={recipe.id} className="profile-recipe-item">
                  <button
                    type="button"
                    className="profile-recipe-link"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    {recipe.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="profile-footer">
          <button
            type="button"
            className="btn btn-ghost-destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading.profile}>
            {loading.profile ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {showDeleteModal && (
        <ConfirmModal
          message="Are you sure you want to delete your account? All your data will be permanently removed. This cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </PageShell>
  )
}
