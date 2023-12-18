import ApiError from '../exceptions/api-error.js'

class CartController {
  async shippingHandler(req, res, next) {
    try {
      if (!req.body) {
        return ApiError.BadRequest('Body is empty')
      }

      return res.json({ success: true, message: 'Success' })
    } catch (error) {
      next(error)
    }
  }
}

export default new CartController()
