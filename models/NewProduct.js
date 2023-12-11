import mongoose from 'mongoose'
import { newProductsCollection } from '../data/config.js'

const { Schema, model, models } = mongoose

const productSchema = new Schema({
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

const NewProduct = models.NewProduct || model('NewProduct', productSchema, newProductsCollection)

export default NewProduct
