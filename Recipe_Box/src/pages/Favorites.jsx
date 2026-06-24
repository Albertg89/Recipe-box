import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import PageShell from '../components/PageShell.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import './Favorites.css'

export default function Favorites() {
  const navigate = useNavigate()
  const { favorites, removeFavorite, loading, appError } = useApp()
  const [pendingDelete, setPendingDelete] = useState(null)

  async function handleDeleteConfirm() {
    await removeFavorite(pendingDelete)
    setPendingDelete(null)
  }

  return (
    <PageShell banner="Your Favorites">
      {appError && <div className="error-banner">{appError}</div>}
      {loading.favorites ? (
        <div className="favorites-empty"><p>Loading your favorites…</p></div>
      ) : favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>You haven't saved any recipes yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(recipe => (
            <div key={recipe.id} className="fav-card">
              <button
                className="fav-card-body"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <div className="fav-card-img">
                  {recipe.image
                    ? <img src={recipe.image} alt={recipe.name} />
                    : <span className="fav-card-emoji">🍽️</span>
                  }
                </div>
                <span className="fav-card-name">{recipe.name}</span>
              </button>
              <div className="fav-card-actions">
                <button
                  className="btn btn-ghost-destructive fav-delete-btn"
                  onClick={() => setPendingDelete(recipe.id)}
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          message="Remove this recipe from your favorites? You can always save it again later."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </PageShell>
  )
}
