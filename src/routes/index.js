import { Router } from 'express'
import ProductsController from '#controllers/products-controller.js'
import UserController from '#controllers/user-controller.js'
import CartController from '#controllers/cart-controller.js'
import authMiddleware from '#middlewares/auth-middleware.js'
import { validateNewUser } from '#utils/userValidation.js'

const router = new Router()

router.post('/auth/signUp', validateNewUser, UserController.signUp)
router.post('/auth/signIn', UserController.signIn)
router.post('/auth/logOut', UserController.logOut)
router.post('/cartForm', authMiddleware, CartController.handleProductsShipping)

router.get('/activate/:link', UserController.activateAccount)
router.post('/auth/refresh', UserController.refresh)
router.get('/profile', authMiddleware, UserController.getUserInfo)

router.get('/newProducts', ProductsController.getNewProducts)
router.get('/laptops', ProductsController.getLaptops)

export default router
