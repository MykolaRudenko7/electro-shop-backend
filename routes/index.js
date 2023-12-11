import { Router } from 'express'
import ProductsController from '../controllers/products-controller.js'
import UserController from '../controllers/user-controller.js'

const router = new Router()

router.post('/auth/signUp', UserController.signUp)
router.get('/activate/:link', UserController.activateUser)
// router.post('/auth/signIn', UserController.signIn)
// router.post('/auth/logOut', UserController.logOut)

// router.get('/auth/refresh', UserController.refresh)
// router.get('/profile', UserController.getUser)

router.get('/newProducts', ProductsController.getNewProducts)
router.get('/laptops', ProductsController.getLaptops)

export default router
