import { config } from 'dotenv'

config()

export const appEndpoints = {
  client: process.env.CLIENT_URL,
  backend: process.env.BACKEND_URL,
}
