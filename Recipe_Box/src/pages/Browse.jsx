import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import * as mealdbService from '../services/mealdbService.js'
import './Browse.css'

export default function Browse() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    mealdbService.getRandomBatch(12)
      .then(meals => {
        if (!cancelled) setResults(meals)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load recipes. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setActiveQuery(q)
    setError('')
    setLoading(true)
    try {
      const meals = await mealdbService.search(q)
      setResults(meals)
    } catch {
      setError('Could not load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleClear() {
    setActiveQuery('')
    setQuery('')
    setError('')
    setLoading(true)
    try {
      const meals = await mealdbService.getRandomBatch(12)
      setResults(meals)
    } catch {
      setError('Could not load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadMore() {
    setLoadingMore(true)
    try {
      const more = await mealdbService.getRandomBatch(12)
      setResults(prev => {
        const seen = new Set(prev.map(r => r.id))
        return [...prev, ...more.filter(r => !seen.has(r.id))]
      })
    } catch {
      // silently ignore load-more failures
    } finally {
      setLoadingMore(false)
    }
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
            {results.length === 0
              ? `No results for "${activeQuery}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${activeQuery}"`}
          </span>
          <button className="browse-clear-btn" onClick={handleClear}>Clear search</button>
        </div>
      )}

      {error && <p className="browse-no-results">{error}</p>}

      {loading ? (
        <p className="browse-no-results">Loading recipes…</p>
      ) : results.length === 0 && !error ? (
        <p className="browse-no-results">
          No recipes matched your search. Try a different keyword.
        </p>
      ) : (
        <>
          <div className="browse-grid">
            {results.map(recipe => (
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

          {!activeQuery && (
            <div className="browse-load-more">
              <button
                className="btn btn-secondary"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading…' : 'Load more recipes'}
              </button>
            </div>
          )}
        </>
      )}
    </PageShell>
  )
}
