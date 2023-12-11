import { config } from 'dotenv'
import crypto from 'crypto'

config()

export const accessTokenKey = crypto.randomBytes(256).toString('base64')
export const refreshTokenKey = crypto.randomBytes(256).toString('base64')

export const accessTokenExpires = process.env.ACCESS_TOKEN_EXPIRES_IN
export const refreshTokenExpires = process.env.REFRESH_TOKEN_EXPIRES_IN

export const salt = process.env.SALT

export const mongoDbURL = process.env.MONGODB_URL
export const usersCollection = process.env.USERS_COLLECTION
export const tokensCollection = process.env.TOKENS_COLLECTION
export const laptopsCollection = process.env.LAPTOPS_COLLECTION
export const newProductsCollection = process.env.NEW_PRODUCTS_COLLECTION

export const smprtHost = process.env.SMPRT_HOST
export const smprtPort = process.env.SMPRT_PORT
export const mailAddress = process.env.MAIL_ADDRESS
export const mailPassword = process.env.MAIL_PASSWORD

export const electroShopClientAddress = process.env.CLIENT_URL
export const electroShopBackendAddress = process.env.BACKEND_URL

export const isProduction = process.env.NODE_ENV === 'production'
