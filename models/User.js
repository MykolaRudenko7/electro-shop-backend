import mongoose from 'mongoose'
import { usersCollection } from '../data/config.js'

const { Schema, model, models } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [4, 'Name should be at least 4 characters'],
    maxLength: [30, 'Name, should be less than 30 characters'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
    minLength: [6, 'Password should be at least 6 characters long'],
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true,
  },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String, default: true },
})

const User = models.User || model('User', userSchema, usersCollection)

export default User
