import { config } from 'dotenv'

config()

export const mongoConfig = {
  mongoDbURL: process.env.MONGODB_URL,
  usersCollection: process.env.USERS_COLLECTION,
  tokensCollection: process.env.TOKENS_COLLECTION,
  laptopsCollection: process.env.LAPTOPS_COLLECTION,
  newProductsCollection: process.env.NEW_PRODUCTS_COLLECTION,
}

export const nodemailerConfig = {
  smprtHost: process.env.SMPRT_HOST,
  smprtPort: process.env.SMPRT_PORT,
  mailAddress: process.env.MAIL_ADDRESS,
  mailPassword: process.env.MAIL_PASSWORD,
}

export const tokenConfig = {
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  accessTokenExpirationTime: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpirationTime: process.env.REFRESH_TOKEN_EXPIRES_IN,
}

export const salt = process.env.SALT
