import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import connectToMongoDB from './src/utils/db.js'
import router from './src/routes/index.js'
import errorMiddleware from './src/middlewares/error-middleware.js'
import { appAddresses } from './src/data/config.js'

config()

const PORT = process.env.PORT
const port = PORT || 3002
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: appAddresses.client,
    credentials: true,
  }),
)
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await connectToMongoDB()
    app.listen(port, () => console.log(`Listening on port ${port}...`))
  } catch (error) {
    console.log('Error:', error)
  }
}

start()
