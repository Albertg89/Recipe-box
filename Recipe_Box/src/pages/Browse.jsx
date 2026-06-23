import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { mockRecipes } from '../data/mockRecipes.js'
import './Browse.css'

const PAGE_SIZE = 6

export default function Browse() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = activeQuery
    ? mockRecipes.filter(r =>
        r.name.toLowerCase().includes(activeQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(activeQuery.toLowerCase()) ||
        r.area.toLowerCase().includes(activeQuery.toLowerCase())
      )
    : mockRecipes

  const displayed = activeQuery ? filtered : filtered.slice(0, visibleCount)
  const hasMore = !activeQuery && visibleCount < mockRecipes.length

  function handleSearch(e) {
    e.preventDefault()
    setActiveQuery(query.trim())
    setVisibleCount(PAGE_SIZE)
  }

  function handleClear() {
    setActiveQuery('')
    setQuery('')
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <PageShell banner="Find your next meal!">
      <div className="browse-search-section">
        <label className="browse-search-label">Type a keyword for search:</label>
        <form className="browse-search-row" onSubmit={handleSearch}>
          <input
            type="search"
            className="browse-search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. chicken, pasta, Italian…"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {activeQuery && (
        <div className="browse-results-meta">
          <span>
            {filtered.length === 0
              ? `No results for "${activeQuery}"`
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${activeQuery}"`}
          </span>
          <button className="browse-clear-btn" onClick={handleClear}>Clear search</button>
        </div>
      )}

      {displayed.length === 0 ? (
        <p className="browse-no-results">
          No recipes matched your search. Try a different keyword.
        </p>
      ) : (
        <div className="browse-grid">
          {displayed.map(recipe => (
            <button
              key={recipe.id}
              className="recipe-card"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="recipe-card-img">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
              <div className="recipe-card-footer">
                <span className="recipe-card-name">{recipe.name}</span>
                <span className="recipe-card-meta">{recipe.area} · {recipe.category}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="browse-load-more">
          <button className="btn btn-secondary" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
            Load more recipes
          </button>
        </div>
      )}
    </PageShell>
  )
}
