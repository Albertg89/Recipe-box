import axios from 'axios'

const mealdb = axios.create({
  baseURL: import.meta.env.VITE_MEALDB_URL,
})

function fromMealDB(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const name    = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (name) ingredients.push({ name, measure: measure || '' })
  }

  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r\n|\n/).map(s => s.trim()).filter(Boolean)
    : []

  return {
    id:          parseInt(meal.idMeal, 10),
    name:        meal.strMeal,
    category:    meal.strCategory ?? '',
    area:        meal.strArea ?? '',
    image:       meal.strMealThumb ?? null,
    description: '',
    prepTime:    '',
    ingredients,
    instructions,
  }
}

function fromFilter(meal) {
  return {
    id:          parseInt(meal.idMeal, 10),
    name:        meal.strMeal,
    category:    '',
    area:        '',
    image:       meal.strMealThumb ?? null,
    description: '',
    prepTime:    '',
    ingredients: [],
    instructions: [],
  }
}

export async function getRandom() {
  const { data } = await mealdb.get('/random.php')
  return data.meals ? fromMealDB(data.meals[0]) : null
}

export async function getRandomBatch(count = 12) {
  const results = await Promise.all(
    Array.from({ length: count }, () => getRandom())
  )
  const seen = new Set()
  return results.filter(meal => {
    if (!meal || seen.has(meal.id)) return false
    seen.add(meal.id)
    return true
  })
}

export async function search(query) {
  const [nameRes, categoryRes, areaRes] = await Promise.allSettled([
    mealdb.get('/search.php',  { params: { s: query } }),
    mealdb.get('/filter.php',  { params: { c: query } }),
    mealdb.get('/filter.php',  { params: { a: query } }),
  ])

  const seen = new Set()
  const meals = []

  const nameResults = nameRes.status === 'fulfilled' && nameRes.value.data.meals
    ? nameRes.value.data.meals.map(fromMealDB)
    : []

  const filterResults = [
    ...(categoryRes.status === 'fulfilled' && categoryRes.value.data.meals
      ? categoryRes.value.data.meals.map(fromFilter)
      : []),
    ...(areaRes.status === 'fulfilled' && areaRes.value.data.meals
      ? areaRes.value.data.meals.map(fromFilter)
      : []),
  ]

  for (const meal of [...nameResults, ...filterResults]) {
    if (!seen.has(meal.id)) {
      seen.add(meal.id)
      meals.push(meal)
    }
  }

  return meals
}

export async function getById(id) {
  const { data } = await mealdb.get('/lookup.php', { params: { i: id } })
  return data.meals ? fromMealDB(data.meals[0]) : null
}
