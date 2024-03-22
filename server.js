/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import connectToMongoDB from '#utils/db.js'
import router from '#routes/index.js'
import errorMiddleware from '#middlewares/error-middleware.js'
import appEndpoints from '#data/appEndpoints.js'

config()

const { PORT } = process.env
const port = PORT || 3002
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: appEndpoints.client,
    credentials: true,
  }),
)
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await connectToMongoDB()
    app.listen(port)
  } catch (error) {
    console.log('Error:', error)
  }
}

start()

export default app
