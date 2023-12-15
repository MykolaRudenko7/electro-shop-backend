import { Router } from 'express'
import { body } from 'express-validator'
import ProductsController from '../controllers/products-controller.js'
import UserController from '../controllers/user-controller.js'
import CartController from '../controllers/cart-controller.js'
import authMiddleware from '../middlewares/auth-middleware.js'

const router = new Router()

router.post(
  '/auth/signUp',
  body('name_newUser').isLength({ min: 4, max: 20 }),
  body('email_newUser').isEmail(),
  body('password_newUser').isLength({ min: 6, max: 30 }),
  body('mobileNumber_newUser').isLength({ min: 10, max: 13 }),
  UserController.signUp,
)
router.post('/auth/signIn', UserController.signIn)
router.post('/auth/logOut', UserController.logOut)
router.post('/cartForm', authMiddleware, CartController.shippingHandler)

router.get('/activate/:link', UserController.activateUser)
router.post('/auth/refresh', UserController.refresh)
router.get('/profile', authMiddleware, UserController.getUserInfo)

router.get('/newProducts', ProductsController.getNewProducts)
router.get('/laptops', ProductsController.getLaptops)

export default router
