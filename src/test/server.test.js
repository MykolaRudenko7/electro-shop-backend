import mongoose from 'mongoose'
import supertest from 'supertest'
import appEndpoints from '#data/appEndpoints.js'
import app from '#server'

const request = supertest(app)

describe('Test API requests', () => {
  let testServer

  beforeAll(() => {
    testServer = app.listen()
  })

  afterAll(() => {
    return new Promise((resolve) => {
      testServer.close(() => {
        mongoose.connection.close()
        resolve()
      })
    })
  })

  it('Should return 200 status and text on successful request', async () => {
    const response = await request.get(appEndpoints.testUrl)
    expect(response.status).toEqual(200)
    expect(response.text).toEqual('Test OK!')
  })
})
