import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [favorites, setFavorites] = useState([])
  const [myRecipes, setMyRecipes] = useState([])

  function register({ firstName, lastName, username, email, password }) {
    const newUser = { id: Date.now(), firstName, lastName, username, email, password }
    setRegisteredUsers(prev => [...prev, newUser])
    setFavorites([])
    setMyRecipes([])
    setUser(newUser)
  }

  function login(email, password) {
    const found = registeredUsers.find(
      u => u.email === email && u.password === password
    )
    if (found) {
      setFavorites(found.favorites ?? [])
      setMyRecipes(found.myRecipes ?? [])
      setUser(found)
      return true
    }
    return false
  }

  function logout() {
    setRegisteredUsers(prev =>
      prev.map(u => u.id === user.id ? { ...u, favorites, myRecipes } : u)
    )
    setFavorites([])
    setMyRecipes([])
    setUser(null)
  }

  function updateProfile(changes) {
    const updated = { ...user, ...changes }
    setUser(updated)
    setRegisteredUsers(prev => prev.map(u => (u.id === user.id ? updated : u)))
  }

  function deleteAccount() {
    setUser(null)
    setFavorites([])
    setMyRecipes([])
  }

  function addFavorite(recipe) {
    setFavorites(prev => {
      if (prev.find(r => r.id === recipe.id)) return prev
      return [...prev, recipe]
    })
  }

  function removeFavorite(recipeId) {
    setFavorites(prev => prev.filter(r => r.id !== recipeId))
  }

  function isFavorite(recipeId) {
    return favorites.some(r => r.id === recipeId)
  }

  function createRecipe(recipe) {
    const newRecipe = { ...recipe, id: Date.now() }
    setMyRecipes(prev => [...prev, newRecipe])
    return newRecipe
  }

  function updateRecipe(id, changes) {
    setMyRecipes(prev => prev.map(r => (r.id === id ? { ...r, ...changes } : r)))
  }

  function deleteRecipe(id) {
    setMyRecipes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <AppContext.Provider value={{
      user,
      registeredUsers,
      favorites,
      myRecipes,
      register,
      login,
      logout,
      updateProfile,
      deleteAccount,
      addFavorite,
      removeFavorite,
      isFavorite,
      createRecipe,
      updateRecipe,
      deleteRecipe,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
