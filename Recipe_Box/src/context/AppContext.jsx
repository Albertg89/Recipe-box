/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import * as recipeService from '../services/recipeService.js'
import * as favoritesService from '../services/favoritesService.js'
import * as userService from '../services/userService.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers') ?? '[]')
    } catch {
      return []
    }
  })
  const [favorites, setFavorites] = useState([])
  const [myRecipes, setMyRecipes] = useState([])
  const [loading, setLoading] = useState({ recipes: false, favorites: false, profile: false })
  const [appError, setAppError] = useState(null)

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
  }, [registeredUsers])

  function setLoadingKey(key, value) {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  // ── Auth (in-memory only, Supabase auth not yet implemented) ──────────────

  function register({ firstName, lastName, username, email, password }) {
    const newUser = { id: crypto.randomUUID(), firstName, lastName, username, email, password }
    setRegisteredUsers(prev => [...prev, newUser])
    setFavorites([])
    setMyRecipes([])
    setUser(newUser)
    userService.createUser(newUser).catch(err =>
      console.error('Failed to create user in Supabase:', err)
    )
  }

  async function login(email, password) {
    const found = registeredUsers.find(
      u => u.email === email && u.password === password
    )
    if (!found) return false

    setUser(found)

    setLoadingKey('recipes', true)
    setLoadingKey('favorites', true)
    setAppError(null)
    try {
      const [recipes, favs] = await Promise.all([
        recipeService.getRecipes(found.id),
        favoritesService.getFavorites(found.id),
      ])
      setMyRecipes(recipes)
      setFavorites(favs)
    } catch (err) {
      setAppError('Failed to load your data. Please refresh and try again.')
      console.error(err)
    } finally {
      setLoadingKey('recipes', false)
      setLoadingKey('favorites', false)
    }
    return true
  }

  function logout() {
    setFavorites([])
    setMyRecipes([])
    setUser(null)
    setAppError(null)
  }

  async function updateProfile(changes) {
    const updated = { ...user, ...changes }
    setUser(updated)
    setRegisteredUsers(prev => prev.map(u => (u.id === user.id ? updated : u)))

    setLoadingKey('profile', true)
    try {
      await userService.updateUser(user.id, changes)
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoadingKey('profile', false)
    }
  }

  function deleteAccount() {
    setUser(null)
    setFavorites([])
    setMyRecipes([])
  }

  // ── Favorites ─────────────────────────────────────────────────────────────

  async function addFavorite(recipe) {
    if (favorites.find(r => r.id === recipe.id)) return
    setLoadingKey('favorites', true)
    setAppError(null)
    try {
      const saved = await favoritesService.addFavorite(user.id, recipe)
      setFavorites(prev => [...prev, saved])
    } catch (err) {
      setAppError('Could not save recipe. Please try again.')
      console.error(err)
    } finally {
      setLoadingKey('favorites', false)
    }
  }

  async function removeFavorite(recipeId) {
    const item = favorites.find(r => r.id === recipeId)
    if (!item) return
    setLoadingKey('favorites', true)
    setAppError(null)
    try {
      await favoritesService.removeFavorite(item.supabaseId)
      setFavorites(prev => prev.filter(r => r.id !== recipeId))
    } catch (err) {
      setAppError('Could not remove recipe. Please try again.')
      console.error(err)
    } finally {
      setLoadingKey('favorites', false)
    }
  }

  function isFavorite(recipeId) {
    return favorites.some(r => r.id === recipeId)
  }

  // ── User Recipes ──────────────────────────────────────────────────────────

  async function createRecipe(recipe) {
    setLoadingKey('recipes', true)
    setAppError(null)
    try {
      const created = await recipeService.createRecipe(user.id, recipe)
      setMyRecipes(prev => [...prev, created])
      return created
    } catch (err) {
      setAppError('Could not save recipe. Please try again.')
      console.error(err)
      throw err
    } finally {
      setLoadingKey('recipes', false)
    }
  }

  async function updateRecipe(id, changes) {
    setLoadingKey('recipes', true)
    setAppError(null)
    try {
      const updated = await recipeService.updateRecipe(id, changes)
      setMyRecipes(prev => prev.map(r => (r.id === id ? updated : r)))
    } catch (err) {
      setAppError('Could not update recipe. Please try again.')
      console.error(err)
      throw err
    } finally {
      setLoadingKey('recipes', false)
    }
  }

  async function deleteRecipe(id) {
    setLoadingKey('recipes', true)
    setAppError(null)
    try {
      await recipeService.deleteRecipe(id)
      setMyRecipes(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      setAppError('Could not delete recipe. Please try again.')
      console.error(err)
    } finally {
      setLoadingKey('recipes', false)
    }
  }

  return (
    <AppContext.Provider value={{
      user,
      registeredUsers,
      favorites,
      myRecipes,
      loading,
      appError,
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
