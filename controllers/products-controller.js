import Laptop from '../models/Laptop.js'
import NewProduct from '../models/NewProduct.js'

class ProductsController {
  async getLaptops(req, res, next) {
    try {
      const laptops = await Laptop.find({})

      if (laptops) {
        return res.json(laptops).status(200)
      }

      return res.json({ error: 'Internal Server Error' }).status(500)
    } catch (error) {
      return res.json({ error: 'Internal Server Error' }).status(500)
    }
  }

  async getNewProducts(req, res, next) {
    try {
      const newProducts = await NewProduct.find({})

      if (newProducts) {
        return res.json(newProducts).status(200)
      }

      return res.json({ error: 'Internal Server Error' }).status(500)
    } catch (error) {
      return res.json({ error: 'Internal Server Error' }).status(500)
    }
  }
}

export default new ProductsController()
