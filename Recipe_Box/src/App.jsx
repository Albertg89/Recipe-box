import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'

import Landing      from './pages/Landing.jsx'
import Auth         from './pages/Auth.jsx'
import Home         from './pages/Home.jsx'
import Browse       from './pages/Browse.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import Favorites    from './pages/Favorites.jsx'
import MyRecipes    from './pages/MyRecipes.jsx'
import CreateRecipe from './pages/CreateRecipe.jsx'
import Profile      from './pages/Profile.jsx'
import Contact      from './pages/Contact.jsx'
import ErrorPage    from './pages/Error.jsx'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"              element={<Landing />} />
      <Route path="/auth"          element={<Auth />} />
      <Route path="/home"          element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/browse"        element={<ProtectedRoute><Browse /></ProtectedRoute>} />
      <Route path="/recipe/:id"    element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
      <Route path="/favorites"     element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/my-recipes"    element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
      <Route path="/create-recipe" element={<ProtectedRoute><CreateRecipe /></ProtectedRoute>} />
      <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/contact"       element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="*"              element={<ErrorPage />} />
    </Routes>
  )
}
