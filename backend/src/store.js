import { existsSync, readFileSync, writeFileSync } from 'node:fs'

// shortcut: one JSON file instead of PostGIS, so admin edits are lost on a redeploy. Move to Supabase before evaluation.
const SEED = new URL('../data/campus.sample.json', import.meta.url)
const LIVE = new URL('../data/campus.json', import.meta.url)
// Accounts live apart from campus data, which /api/data sends to every visitor.
const USERS = new URL('../data/users.json', import.meta.url)

export const data = JSON.parse(readFileSync(existsSync(LIVE) ? LIVE : SEED, 'utf8'))

export const users = existsSync(USERS) ? JSON.parse(readFileSync(USERS, 'utf8')) : []

export function saveUsers() {
  writeFileSync(USERS, JSON.stringify(users, null, 1))
}

export function save() {
  writeFileSync(LIVE, JSON.stringify(data, null, 1))
}
