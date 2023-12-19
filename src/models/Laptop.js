import mongoose from 'mongoose'
import { mongoConfig } from '#data/config.js'

const { Schema, model, models } = mongoose
const { laptopsCollection } = mongoConfig

const laptopSchema = new Schema({
  inStock: {
    type: Boolean,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  reviewsCount: {
    type: Number,
    required: true,
  },
  previousPrice: {
    type: Number,
  },
  rating: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

const Laptop = models.Laptop || model('Laptop', laptopSchema, laptopsCollection)

export default Laptop
