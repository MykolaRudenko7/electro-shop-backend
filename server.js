import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import connectToMongoDB from './utils/db.js'
import router from './routes/index.js'

config()

const PORT = process.env.PORT
const port = PORT || 3002
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)
app.use('/api', router)

const start = async () => {
  try {
    await connectToMongoDB()
    app.listen(port, () => console.log(`Listening on port ${port}...`))
  } catch (error) {
    console.log('Error:', error)
  }
}

start()
