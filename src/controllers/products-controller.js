import ApiError from '#exceptions/api-error.js'
import Laptop from '#models/Laptop.js'
import NewProduct from '#models/NewProduct.js'

class ProductsController {
  async getLaptops(req, res, next) {
    try {
      const laptops = await Laptop.find({})

      if (!laptops) {
        throw ApiError.BadRequest('Laptops not found')
      }

      return res.json(laptops).status(200)
    } catch (error) {
      next(error)
      return null
    }
  }

  async getNewProducts(req, res, next) {
    try {
      const newProducts = await NewProduct.find({})

      if (!newProducts) {
        throw ApiError.BadRequest('New Products not found')
      }

      return res.json(newProducts).status(200)
    } catch (error) {
      next(error)
      return null
    }
  }
}

export default new ProductsController()
