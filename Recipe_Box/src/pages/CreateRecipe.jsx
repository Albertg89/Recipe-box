import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import PageShell from '../components/PageShell.jsx'
import './CreateRecipe.css'

function parseIngredients(text) {
  return text
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => ({ name: s, measure: '' }))
}

function parseInstructions(text) {
  return text
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
}

function ingredientsToText(ingredients) {
  if (!ingredients || !ingredients.length) return ''
  return ingredients.map(i => (i.measure ? `${i.measure} ${i.name}` : i.name)).join('\n')
}

export default function CreateRecipe() {
  const navigate = useNavigate()
  const location = useLocation()
  const { createRecipe, updateRecipe, loading } = useApp()

  const editRecipe = location.state?.recipe ?? null
  const isEditing = !!editRecipe

  const [form, setForm] = useState({
    name:         editRecipe?.name ?? '',
    category:     editRecipe?.category ?? '',
    prepTime:     editRecipe?.prepTime ?? '',
    ingredients:  editRecipe ? ingredientsToText(editRecipe.ingredients) : '',
    instructions: editRecipe ? (editRecipe.instructions ?? []).join('\n') : '',
  })
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading.recipes) return
    setError('')
    if (!form.name.trim()) {
      setError('Please enter a recipe name.')
      return
    }
    if (!form.ingredients.trim()) {
      setError('Please add at least one ingredient.')
      return
    }
    if (!form.instructions.trim()) {
      setError('Please add cooking instructions.')
      return
    }

    const payload = {
      name:         form.name.trim(),
      category:     form.category.trim(),
      prepTime:     form.prepTime.trim(),
      ingredients:  parseIngredients(form.ingredients),
      instructions: parseInstructions(form.instructions),
      image:        null,
      description:  '',
    }

    try {
      if (isEditing) {
        await updateRecipe(editRecipe.id, payload)
      } else {
        await createRecipe(payload)
      }
      navigate('/my-recipes')
    } catch {
      setError('Something went wrong saving your recipe. Please try again.')
    }
  }

  return (
    <PageShell banner="Your Recipe">
      <form className="create-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="error-banner">{error}</div>}

        <div className="create-field">
          <label className="create-label">Name of recipe</label>
          <input
            type="text"
            placeholder="e.g. Grandma's Lasagne"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        <div className="create-row">
          <div className="create-field">
            <label className="create-label">Category</label>
            <input
              type="text"
              placeholder="e.g. Pasta"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            />
          </div>
          <div className="create-field">
            <label className="create-label">Prep Time</label>
            <input
              type="text"
              placeholder="e.g. 45 mins"
              value={form.prepTime}
              onChange={e => set('prepTime', e.target.value)}
            />
          </div>
        </div>

        <div className="create-field">
          <label className="create-label">Ingredients</label>
          <p className="create-hint">One ingredient per line, e.g. "2 cups flour"</p>
          <textarea
            rows={6}
            placeholder={"2 cups flour\n1 tsp salt\n3 large eggs"}
            value={form.ingredients}
            onChange={e => set('ingredients', e.target.value)}
          />
        </div>

        <div className="create-field">
          <label className="create-label">Instructions</label>
          <p className="create-hint">One step per line</p>
          <textarea
            rows={8}
            placeholder={"Preheat oven to 180°C.\nMix dry ingredients together.\nBake for 30 minutes."}
            value={form.instructions}
            onChange={e => set('instructions', e.target.value)}
          />
        </div>

        <div className="create-footer">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-recipes')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading.recipes}>
            {loading.recipes ? 'Saving…' : isEditing ? 'Save Changes' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </PageShell>
  )
}
