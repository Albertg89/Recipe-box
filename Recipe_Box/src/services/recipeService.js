import api from './api.js'

function toDb(userId, recipe) {
  return {
    user_id: userId,
    title: recipe.name,
    category: recipe.category || null,
    cuisine: recipe.area || '',
    prep_time: recipe.prepTime || null,
    image: recipe.image || null,
    ingredients: JSON.stringify(recipe.ingredients ?? []),
    instructions: JSON.stringify(recipe.instructions ?? []),
  }
}

function fromDb(row) {
  return {
    id: row.id,
    name: row.title,
    category: row.category ?? '',
    area: row.cuisine ?? '',
    prepTime: row.prep_time ?? '',
    image: row.image ?? null,
    ingredients: JSON.parse(row.ingredients || '[]'),
    instructions: JSON.parse(row.instructions || '[]'),
    description: '',
  }
}

export async function getRecipes(userId) {
  const { data } = await api.get('/recipes', {
    params: { user_id: `eq.${userId}`, select: '*' },
  })
  return data.map(fromDb)
}

export async function createRecipe(userId, recipe) {
  const { data } = await api.post('/recipes', toDb(userId, recipe), {
    headers: { Prefer: 'return=representation' },
  })
  return fromDb(data[0])
}

export async function updateRecipe(id, changes) {
  const dbChanges = {}
  if (changes.name !== undefined)         dbChanges.title      = changes.name
  if (changes.category !== undefined)     dbChanges.category   = changes.category
  if (changes.area !== undefined)         dbChanges.cuisine    = changes.area
  if (changes.prepTime !== undefined)     dbChanges.prep_time  = changes.prepTime
  if (changes.image !== undefined)        dbChanges.image      = changes.image
  if (changes.ingredients !== undefined)  dbChanges.ingredients  = JSON.stringify(changes.ingredients)
  if (changes.instructions !== undefined) dbChanges.instructions = JSON.stringify(changes.instructions)

  const { data } = await api.patch('/recipes', dbChanges, {
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' },
  })
  return fromDb(data[0])
}

export async function deleteRecipe(id) {
  await api.delete('/recipes', { params: { id: `eq.${id}` } })
}
