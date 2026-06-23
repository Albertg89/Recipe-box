import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Logo from '../components/Logo.jsx'
import Nav from '../components/Nav.jsx'
import './Home.css'

export default function Home() {
  const { user, favorites, myRecipes } = useApp()
  const navigate = useNavigate()

  const recentFavorites = favorites.slice(-3).reverse()
  const recentMyRecipes = myRecipes.slice(-3).reverse()

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <Logo />

        <div className="home-welcome-banner">
          Welcome back, {user?.username}!
        </div>

        <Nav />

        <div className="home-content">
          <section className="home-section">
            <h3 className="home-section-title">Recent favorites:</h3>
            {recentFavorites.length === 0 ? (
              <p className="home-empty">
                No favorites yet — browse recipes to save some!
              </p>
            ) : (
              recentFavorites.map(recipe => (
                <button
                  key={recipe.id}
                  className="home-recipe-row"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  {recipe.name}
                </button>
              ))
            )}
          </section>

          <section className="home-section">
            <h3 className="home-section-title">My Recipes:</h3>
            {recentMyRecipes.length === 0 ? (
              <p className="home-empty">
                No original recipes yet — create your first one!
              </p>
            ) : (
              recentMyRecipes.map(recipe => (
                <button
                  key={recipe.id}
                  className="home-recipe-row"
                  onClick={() => navigate('/my-recipes')}
                >
                  {recipe.name}
                </button>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
