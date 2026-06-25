/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import * as recipeService    from '../services/recipeService.js'
import * as favoritesService from '../services/favoritesService.js'
import * as userService      from '../services/userService.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [myRecipes, setMyRecipes] = useState([])
  const [loading, setLoading]     = useState({ recipes: false, favorites: false, profile: false })
  const [appError, setAppError]   = useState(null)

  function setLoadingKey(key, value) {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  const loadUserData = useCallback(async (userId) => {
    setLoadingKey('recipes', true)
    setLoadingKey('favorites', true)
    setAppError(null)
    try {
      const [recipes, favs] = await Promise.all([
        recipeService.getRecipes(userId),
        favoritesService.getFavorites(userId),
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
  }, [])

  // ── Session restore + auth state listener ────────────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await userService.getUser(session.user.id)
        if (profile) {
          setUser({
            id:        profile.id,
            firstName: profile.first_name,
            lastName:  profile.last_name,
            username:  profile.user_name,
            email:     profile.email,
          })
          await loadUserData(profile.id)
        }
      }
      setInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        setFavorites([])
        setMyRecipes([])
        setAppError(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUserData])

  // ── Auth ─────────────────────────────────────────────────────────────────

  async function register({ firstName, lastName, username, email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (!data.session) return { needsConfirmation: true }

    await userService.createUser({ id: data.user.id, firstName, lastName, username, email })
    setUser({ id: data.user.id, firstName, lastName, username, email })
    setFavorites([])
    setMyRecipes([])
    return { needsConfirmation: false }
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return false

    const profile = await userService.getUser(data.user.id)
    setUser({
      id:        data.user.id,
      firstName: profile.first_name,
      lastName:  profile.last_name,
      username:  profile.user_name,
      email:     profile.email,
    })
    await loadUserData(data.user.id)
    return true
  }

  async function logout() {
    await supabase.auth.signOut()
    // State cleanup handled by onAuthStateChange listener
  }

  async function updateProfile(changes) {
    const updated = { ...user, ...changes }
    setUser(updated)

    setLoadingKey('profile', true)
    try {
      await userService.updateUser(user.id, changes)
    } catch (err) {
      setUser(user)
      console.error(err)
      throw err
    } finally {
      setLoadingKey('profile', false)
    }
  }

  async function deleteAccount() {
    // Signs out on the client. Full auth.users deletion requires a server-side
    // Edge Function with service_role key — the ON DELETE CASCADE will clean up
    // public.users, recipes, and favorites when that is wired up.
    await supabase.auth.signOut()
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
      initialized,
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
