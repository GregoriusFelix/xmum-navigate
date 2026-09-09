import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const app = express()
app.use(cors())
app.use(express.json())

// Health check — confirms the backend is deployed and reachable
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'xmum-navigate-backend' })
})

// DB test route — confirms Supabase/PostGIS connection works.
// Remove this route once you have real routes using the database.
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time, PostGIS_Version() AS postgis_version')
    res.json({ status: 'ok', ...result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})