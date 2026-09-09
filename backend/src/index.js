import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Health check — confirms the backend is deployed and reachable
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'xmum-navigate-backend' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
