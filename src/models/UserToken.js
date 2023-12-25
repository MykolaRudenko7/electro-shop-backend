import mongoose from 'mongoose'
import { mongoConfig } from '#data/config.js'

const { Schema, model, models } = mongoose
const { tokensCollection } = mongoConfig

const userTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 },
})

const UserToken = models.UserToken || model('UserToken', userTokenSchema, tokensCollection)

export default UserToken
