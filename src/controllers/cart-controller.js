import ApiError from '#exceptions/api-error.js'

class CartController {
  async handleProductsShipping(req, res, next) {
    try {
      if (!req.body) {
        throw ApiError.BadRequest('Body is empty')
      }

      return res.json({ success: true, message: 'Success' })
    } catch (error) {
      return next(error)
    }
  }
}

export default new CartController()
