import mongoose from 'mongoose'
import { mongoDbURL } from '../data/config.js'

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
