class TestController {
  async getTest(req, res, next) {
    try {
      return await res.status(200).send('Test OK!')
    } catch (error) {
      return next(error)
    }
  }
}

export default new TestController()
