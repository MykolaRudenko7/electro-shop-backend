import { config } from 'dotenv'

config()

const appEndpoints = {
  client: process.env.CLIENT_URL,
  backend: process.env.BACKEND_URL,
  testUrl: process.env.TEST_URL,
}

export default appEndpoints
