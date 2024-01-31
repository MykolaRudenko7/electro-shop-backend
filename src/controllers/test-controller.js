class TestController {
  async getTest(req, res, next) {
    try {
      return await res.status(200).send('Test OK!')
    } catch (error) {
      next(error)
      return null
    }
  }
}

export default new TestController()
