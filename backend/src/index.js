import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { data, save, saveUsers, users } from './store.js'
import { findRoute, insidePolygon } from './routing.js'
import { recommendVenues } from './venues.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '100kb' }))

const fail = (res, status, code, message) => res.status(status).json({ code, message })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'xmum-navigate-backend' })
})

app.get('/api/data', (req, res) => res.json(data))

// Admin sessions live in memory, so a restart signs the admin out.
const sessions = new Set()
let failedLogins = []
const isAdmin = req => sessions.has((req.get('authorization') || '').replace('Bearer ', ''))
const requireAdmin = (req, res, next) => isAdmin(req) ? next() : fail(res, 401, 'unauthorized', 'Log in as admin first.')

app.post('/api/admin/login', (req, res) => {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return fail(res, 503, 'no_admin', 'Set ADMIN_PASSWORD in backend/.env to enable admin login.')
  failedLogins = failedLogins.filter(time => Date.now() - time < 60000)
  if (failedLogins.length >= 5) return fail(res, 429, 'locked', 'Too many attempts. Wait a minute and try again.')
  const given = Buffer.from(String(req.body.password ?? ''))
  const wanted = Buffer.from(expected)
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
    failedLogins.push(Date.now())
    return fail(res, 401, 'wrong_password', 'Wrong password.')
  }
  const token = randomBytes(32).toString('hex')
  sessions.add(token)
  res.json({ token })
})

// User sessions live in memory like admin ones, so a restart signs everyone out.
const userSessions = new Map()
const failedByEmail = new Map()
const hashPassword = (password, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
function checkPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, 'hex'))
}
const currentUser = req => users.find(user => user.id === userSessions.get(req.get('x-user-token') || ''))
const publicUser = user => ({ name: user.name, email: user.email, saved: user.saved, history: user.history })
function startSession(user) {
  const token = randomBytes(32).toString('hex')
  userSessions.set(token, user.id)
  return { token, user: publicUser(user) }
}

app.post('/api/auth/register', (req, res) => {
  try {
    const email = text(req.body.email, 120).toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Invalid('Enter a valid email address.')
    const password = String(req.body.password ?? '')
    if (password.length < 8 || password.length > 200) throw new Invalid('Use a password of at least 8 characters.')
    if (users.some(user => user.email === email)) return fail(res, 409, 'taken', 'An account with this email already exists. Log in instead.')
    const user = { id: randomBytes(8).toString('hex'), name: text(req.body.name, 60), email, password: hashPassword(password), saved: [], history: [] }
    users.push(user)
    saveUsers()
    res.status(201).json(startSession(user))
  } catch (error) {
    if (!(error instanceof Invalid)) throw error
    fail(res, 400, 'invalid', error.message)
  }
})

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase()
  const recent = (failedByEmail.get(email) || []).filter(time => Date.now() - time < 60000)
  if (recent.length >= 5) return fail(res, 429, 'locked', 'Too many attempts. Wait a minute and try again.')
  const user = users.find(entry => entry.email === email)
  if (!user || !checkPassword(String(req.body.password ?? ''), user.password)) {
    failedByEmail.set(email, [...recent, Date.now()])
    return fail(res, 401, 'wrong_login', 'Wrong email or password.')
  }
  failedByEmail.delete(email)
  res.json(startSession(user))
})

function requireUser(req, res, next) {
  req.user = currentUser(req)
  if (!req.user) return fail(res, 401, 'logged_out', 'Log in to use your profile.')
  next()
}
app.get('/api/me', requireUser, (req, res) => res.json(publicUser(req.user)))
app.post('/api/me/logout', (req, res) => {
  userSessions.delete(req.get('x-user-token') || '')
  res.json({ ok: true })
})
app.put('/api/me/saved/:id', requireUser, (req, res) => {
  if (!data.venues.some(venue => venue.id === req.params.id)) return fail(res, 404, 'not_found', 'That venue no longer exists.')
  if (!req.user.saved.includes(req.params.id)) {
    req.user.saved.push(req.params.id)
    saveUsers()
  }
  res.json(publicUser(req.user))
})
app.delete('/api/me/saved/:id', requireUser, (req, res) => {
  req.user.saved = req.user.saved.filter(id => id !== req.params.id)
  saveUsers()
  res.json(publicUser(req.user))
})

// Newest first, one entry per destination and route type; GPS refetches of the same route are skipped.
function remember(user, destinationId, mode) {
  if (user.history[0]?.destinationId === destinationId && user.history[0].mode === mode) return
  user.history = [{ destinationId, mode, at: new Date().toISOString() }, ...user.history.filter(entry => entry.destinationId !== destinationId || entry.mode !== mode)].slice(0, 10)
  saveUsers()
}

const isPoint = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite)

// A destination is a building, or an office, venue or stall inside one.
function goalNode(id) {
  const item = [...data.places, ...data.offices, ...data.venues, ...data.stalls].find(entry => entry.id === id)
  const place = item && (item.node ? item : data.places.find(p => p.id === item.placeId))
  return place?.node
}

app.post('/api/route', (req, res) => {
  const { start, destinationId, mode = 'shortest', spotId, algorithm, manualStart } = req.body
  const goal = goalNode(destinationId)
  if (!isPoint(start) || !goal || !['shortest', 'scenic', 'combined'].includes(mode)) return fail(res, 400, 'bad_request', 'Send start, destinationId and mode.')
  if (algorithm && !['astar', 'dijkstra', 'both'].includes(algorithm)) return fail(res, 400, 'bad_request', 'Unknown algorithm.')
  // Only the admin test option may route from a hand-picked start.
  if (manualStart && !isAdmin(req)) return fail(res, 401, 'unauthorized', 'Log in as admin first.')
  if (!manualStart && !insidePolygon(start, data.boundary)) return fail(res, 422, 'off_campus', 'Routing works only on campus')

  const request = { start, goalNode: goal, mode, spotId }
  if (algorithm === 'both') {
    const [astar, dijkstra] = ['astar', 'dijkstra'].map(name => findRoute(data, { ...request, algorithm: name }))
    if (!astar) return fail(res, 404, 'no_route', 'No open route reaches this destination.')
    return res.json({ ...astar, benchmark: { astar: { ms: astar.ms, visited: astar.visited }, dijkstra: { ms: dijkstra.ms, visited: dijkstra.visited }, sameDistance: astar.distance === dijkstra.distance } })
  }
  const route = findRoute(data, { ...request, algorithm: algorithm || data.settings.algorithm })
  if (!route) return fail(res, 404, 'no_route', 'No open route reaches this destination.')
  const user = currentUser(req)
  if (user) remember(user, destinationId, mode)
  res.json(route)
})

function activeWeights() {
  return data.settings.weights[data.settings.weightVersion]
}

app.post('/api/venues/recommend', (req, res) => {
  const { participants, eventType, facilities = [], setting = 'any' } = req.body
  if (!Number.isInteger(participants) || participants < 1 || typeof eventType !== 'string' || !Array.isArray(facilities) || !['any', 'indoor', 'outdoor'].includes(setting)) {
    return fail(res, 400, 'bad_request', 'Send participants, eventType, facilities and setting.')
  }
  res.json({ weightVersion: data.settings.weightVersion, results: recommendVenues(data.venues, { participants, eventType, facilities, setting }, activeWeights()) })
})

class Invalid extends Error {}
const text = (value, max = 200) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Invalid(`Text of 1 to ${max} characters is required.`)
  return value.trim()
}
const optional = (value, max = 500) => value == null || value === '' ? '' : text(value, max)
const number = (value, min, max) => {
  if (value === '' || value == null || !Number.isFinite(Number(value)) || Number(value) < min || Number(value) > max) throw new Invalid(`A number from ${min} to ${max} is required.`)
  return Number(value)
}
const list = (value, clean = text) => {
  if (!Array.isArray(value) || value.length > 50) throw new Invalid('A list of up to 50 entries is required.')
  return value.map(entry => clean(entry))
}
const placeId = value => {
  if (!data.places.some(place => place.id === value)) throw new Invalid('Choose an existing building.')
  return value
}
const oneOf = (value, options) => {
  if (!options.includes(value)) throw new Invalid(`Choose one of: ${options.join(', ')}.`)
  return value
}

const COLLECTIONS = {
  stalls: body => ({ name: text(body.name), placeId: placeId(body.placeId), hours: text(body.hours), menu: list(body.menu, item => ({ name: text(item?.name), price: text(item?.price, 20) })) }),
  venues: body => ({ name: text(body.name), placeId: placeId(body.placeId), capacity: number(body.capacity, 1, 100000), eventTypes: list(body.eventTypes), facilities: list(body.facilities), setting: oneOf(body.setting, ['indoor', 'outdoor']), description: optional(body.description) }),
  offices: body => ({ name: text(body.name), placeId: placeId(body.placeId), floor: number(body.floor, 0, 60), directions: list(body.directions, step => text(step, 300)) }),
  spots: body => ({ name: text(body.name), lat: number(body.lat, -90, 90), lng: number(body.lng, -180, 180), photo: optional(body.photo), score: number(body.score, 0, 5) }),
}

app.use('/api/admin', requireAdmin)

app.patch('/api/admin/paths/:id', (req, res) => {
  const feature = data.paths.features.find(f => f.properties.path_id === req.params.id)
  if (!feature || typeof req.body.is_closed !== 'boolean') return fail(res, 400, 'bad_request', 'Send is_closed for an existing path.')
  feature.properties.is_closed = req.body.is_closed
  save()
  res.json(feature.properties)
})

app.put('/api/admin/settings', (req, res) => {
  try {
    const weights = req.body.elicited && Object.fromEntries(['capacity', 'eventType', 'facilities', 'setting'].map(key => [key, number(req.body.elicited[key], 0, 100)]))
    if (weights && !Object.values(weights).some(Boolean)) throw new Invalid('At least one weight must be above zero.')
    const version = oneOf(req.body.weightVersion, ['literature', 'elicited'])
    if (version === 'elicited' && !(weights || data.settings.weights.elicited)) throw new Invalid('Enter the survey weights before switching to them.')
    if (weights) data.settings.weights.elicited = weights
    data.settings.weightVersion = version
    save()
    res.json(data.settings)
  } catch (error) {
    if (!(error instanceof Invalid)) throw error
    fail(res, 400, 'invalid', error.message)
  }
})

function editCollection(req, res) {
  const clean = COLLECTIONS[req.params.collection]
  const items = data[req.params.collection]
  if (!clean) return fail(res, 404, 'not_found', 'Unknown collection.')
  const index = req.params.id ? items.findIndex(item => item.id === req.params.id) : -1
  if (req.params.id && index < 0) return fail(res, 404, 'not_found', 'That entry no longer exists.')
  try {
    if (req.method === 'DELETE') items.splice(index, 1)
    else if (req.params.id) items[index] = { id: req.params.id, ...clean(req.body) }
    else items.push({ id: `${req.params.collection[0]}${randomBytes(4).toString('hex')}`, ...clean(req.body) })
    save()
    res.json(items)
  } catch (error) {
    if (!(error instanceof Invalid)) throw error
    fail(res, 400, 'invalid', error.message)
  }
}
app.post('/api/admin/:collection', editCollection)
app.put('/api/admin/:collection/:id', editCollection)
app.delete('/api/admin/:collection/:id', editCollection)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
