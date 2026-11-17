// Set VITE_API_URL when the backend is on another origin (Railway); in dev Vite proxies /api.
const BASE = `${import.meta.env.VITE_API_URL || ''}/api`
const TOKEN_KEY = 'xmum-admin'

export const adminToken = () => sessionStorage.getItem(TOKEN_KEY) || ''
export const setAdminToken = token => token ? sessionStorage.setItem(TOKEN_KEY, token) : sessionStorage.removeItem(TOKEN_KEY)

// Private browsing can block localStorage; the app then just asks again next visit.
function local(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key)
    if (value) localStorage.setItem(key, value); else localStorage.removeItem(key)
  } catch { return null }
}
export const userToken = () => local('xmum-user') || ''
export const setUserToken = token => local('xmum-user', token || null)
export const isGuest = () => local('xmum-guest') === '1'
export const setGuest = on => local('xmum-guest', on ? '1' : null)

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (adminToken()) headers.Authorization = `Bearer ${adminToken()}`
  if (userToken()) headers['X-User-Token'] = userToken()
  const response = await fetch(BASE + path, { method, headers, body: body && JSON.stringify(body) })
  const json = await response.json().catch(() => ({}))
  if (!response.ok) throw Object.assign(new Error(json.message || 'The server could not complete the request.'), { code: json.code })
  return json
}

// Adds each entry's building as `place`, and one flat list of everything a user can route to.
export function withDestinations(data) {
  const inPlace = (items, kind) => items.map(item => ({ ...item, kind, place: data.places.find(place => place.id === item.placeId) }))
  const places = data.places.map(place => ({ ...place, kind: 'place', place }))
  const offices = inPlace(data.offices, 'office')
  const venues = inPlace(data.venues, 'venue')
  const stalls = inPlace(data.stalls, 'stall')
  return { ...data, offices, venues, stalls, destinations: [...places, ...offices, ...venues, ...stalls] }
}

export function destinationDetail(item) {
  if (item.kind === 'office') return `${item.place.name}, Floor ${item.floor}`
  if (item.kind === 'venue') return `Venue in ${item.place.name}`
  if (item.kind === 'stall') return `Stall in ${item.place.name}`
  return item.type
}

// Ray casting over the campus boundary ring of [lat, lng] points.
export function insideCampus([lat, lng], ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lat1, lng1] = ring[i]
    const [lat2, lng2] = ring[j]
    if ((lng1 > lng) !== (lng2 > lng) && lat < (lat2 - lat1) * (lng - lng1) / (lng2 - lng1) + lat1) inside = !inside
  }
  return inside
}
