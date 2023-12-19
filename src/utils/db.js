import mongoose from 'mongoose'
import { mongoConfig } from '#data/config.js'

const { mongoDbURL } = mongoConfig

if (!mongoDbURL) {
  throw new Error('MONGO_URL is not defined.')
}

let cached = global.mongoose

if (!cached) {
  cached = { conn: null }
  global.mongoose = cached
}

const connectToMongoDB = async () => {
  if (cached.conn) {
    return cached.conn
  }
  cached.conn = await mongoose.connect(mongoDbURL)

  return cached.conn
}

export default connectToMongoDB
