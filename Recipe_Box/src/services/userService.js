import api from './api.js'

export async function createUser(user) {
  const { data } = await api.post('/users', {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    user_name: user.username,
    email: user.email,
  }, {
    headers: { Prefer: 'return=representation' },
  })
  return data[0] ?? null
}

export async function getUser(userId) {
  const { data } = await api.get('/users', {
    params: { id: `eq.${userId}`, select: '*' },
  })
  return data[0] ?? null
}

export async function updateUser(userId, changes) {
  const dbChanges = {}
  if (changes.firstName !== undefined) dbChanges.first_name = changes.firstName
  if (changes.lastName !== undefined)  dbChanges.last_name  = changes.lastName
  if (changes.username !== undefined)  dbChanges.user_name  = changes.username
  if (changes.email !== undefined)     dbChanges.email      = changes.email

  const { data } = await api.patch('/users', dbChanges, {
    params: { id: `eq.${userId}` },
    headers: { Prefer: 'return=representation' },
  })
  return data[0] ?? null
}
