import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import PageShell from '../components/PageShell.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import './MyRecipes.css'

export default function MyRecipes() {
  const navigate = useNavigate()
  const { myRecipes, deleteRecipe, loading, appError } = useApp()
  const [pendingDelete, setPendingDelete] = useState(null)

  async function handleDeleteConfirm() {
    await deleteRecipe(pendingDelete)
    setPendingDelete(null)
  }

  return (
    <PageShell banner="My Recipes">
      {appError && <div className="error-banner">{appError}</div>}
      <div className="my-recipes-header">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create-recipe')}
        >
          + Create New Recipe
        </button>
      </div>

      {loading.recipes ? (
        <div className="my-recipes-empty"><p>Loading your recipes…</p></div>
      ) : myRecipes.length === 0 ? (
        <div className="my-recipes-empty">
          <p>You haven't created any recipes yet.</p>
          <p>Click the button above to add your first original recipe!</p>
        </div>
      ) : (
        <ul className="my-recipes-list">
          {myRecipes.map(recipe => (
            <li key={recipe.id} className="my-recipe-row">
              <button
                className="my-recipe-name"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                {recipe.name}
                {recipe.category && (
                  <span className="my-recipe-meta"> · {recipe.category}</span>
                )}
                {recipe.prepTime && (
                  <span className="my-recipe-meta"> · {recipe.prepTime}</span>
                )}
              </button>
              <div className="my-recipe-actions">
                <button
                  className="btn btn-secondary my-recipe-btn"
                  onClick={() => navigate('/create-recipe', { state: { recipe } })}
                >
                  Edit
                </button>
                <button
                  className="btn btn-ghost-destructive my-recipe-btn"
                  onClick={() => setPendingDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingDelete && (
        <ConfirmModal
          message="Delete this recipe permanently? This cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </PageShell>
  )
}
