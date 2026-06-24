import api from './api.js'

function fromDb(row) {
  return {
    supabaseId: row.id,
    id: parseInt(row.mealdb_id, 10),
    name: row.title,
    image: row.image ?? null,
    category: row.category ?? '',
    area: row.area ?? '',
  }
}

export async function getFavorites(userId) {
  const { data } = await api.get('/favorites', {
    params: { user_id: `eq.${userId}`, select: '*' },
  })
  return data.map(fromDb)
}

export async function addFavorite(userId, recipe) {
  const payload = {
    user_id: userId,
    mealdb_id: String(recipe.id),
    title: recipe.name,
    image: recipe.image ?? null,
    category: recipe.category ?? null,
    area: recipe.area ?? null,
  }
  const { data } = await api.post('/favorites', payload, {
    headers: { Prefer: 'return=representation' },
  })
  return fromDb(data[0])
}

export async function removeFavorite(supabaseId) {
  await api.delete('/favorites', { params: { id: `eq.${supabaseId}` } })
}
