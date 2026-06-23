import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import PageShell from '../components/PageShell.jsx'
import { mockRecipes } from '../data/mockRecipes.js'
import './RecipeDetail.css'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, addFavorite, removeFavorite, myRecipes } = useApp()
  const [checked, setChecked] = useState({})

  const recipeId = parseInt(id, 10)
  const recipe =
    mockRecipes.find(r => r.id === recipeId) ||
    myRecipes.find(r => r.id === recipeId)

  if (!recipe) {
    return (
      <PageShell banner="Recipe Not Found">
        <div className="recipe-not-found">
          <p>This recipe doesn't exist or may have been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>
            Back to Browse
          </button>
        </div>
      </PageShell>
    )
  }

  const saved = isFavorite(recipe.id)

  function toggleFavorite() {
    saved ? removeFavorite(recipe.id) : addFavorite(recipe)
  }

  function toggleCheck(i) {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <PageShell banner={recipe.name} wide>
      <div className="recipe-detail">

        {/* Top section: image + meta */}
        <div className="recipe-top">
          <div className="recipe-image-box">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            ) : (
              <div className="recipe-image-placeholder">🍽️</div>
            )}
          </div>

          <div className="recipe-meta">
            <p className="recipe-description">{recipe.description}</p>
            <div className="recipe-tags">
              {recipe.category && <span className="tag">{recipe.category}</span>}
              {recipe.area    && <span className="tag">{recipe.area}</span>}
              {recipe.prepTime && <span className="tag">⏱ {recipe.prepTime}</span>}
            </div>
            <div className="recipe-save-row">
              <button
                className={`btn ${saved ? 'btn-inverted' : 'btn-primary'}`}
                onClick={toggleFavorite}
              >
                {saved ? 'Saved ✓' : 'Save Recipe'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section: ingredients + instructions */}
        <div className="recipe-bottom">
          <div className="recipe-ingredients">
            <h3 className="recipe-section-title">Ingredients:</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className={`ingredient-item${checked[i] ? ' ingredient-item--done' : ''}`}
                >
                  <label className="ingredient-label">
                    <input
                      type="checkbox"
                      checked={!!checked[i]}
                      onChange={() => toggleCheck(i)}
                      className="ingredient-checkbox"
                    />
                    <span className="ingredient-text">
                      {ing.measure && (
                        <span className="ingredient-measure">{ing.measure} </span>
                      )}
                      <span className="ingredient-name">{ing.name}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="recipe-instructions">
            <h3 className="recipe-section-title">Step-by-Step Instructions:</h3>
            <ol className="instructions-list">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="instruction-step">
                  <span className="step-number">Step {i + 1}</span>
                  <div className="step-body">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
