import { validationResult } from 'express-validator'
import { appAddresses } from '../data/config.js'
import TokenService from '../service/token-service.js'
import UserService from '../service/user-service.js'
import ApiError from '../exceptions/api-error.js'

const { electroShopClientAddress } = appAddresses

class UserController {
  async signUp(req, res, next) {
    try {
      const validateErrors = validationResult(req)

      if (!validateErrors.isEmpty()) {
        return next(ApiError.BadRequest('Validate Error', validateErrors.array()))
      }
      const { name_newUser, email_newUser, password_newUser, mobileNumber_newUser } = await req.body

      const userData = await UserService.signUpUser(
        name_newUser,
        email_newUser,
        password_newUser,
        mobileNumber_newUser,
      )

      return TokenService.handleSetResponse(res, userData, 'Registration was successful')
    } catch (error) {
      next(error)
    }
  }

  async activateUser(req, res, next) {
    try {
      const activationLink = req.params.link
      await UserService.activate(activationLink)

      return res.redirect(electroShopClientAddress)
    } catch (error) {
      next(error)
    }
  }

  async signIn(req, res, next) {
    try {
      const { email_signIn, password_signIn } = await req.body
      const userData = await UserService.signInUser(email_signIn, password_signIn)

      return TokenService.handleSetResponse(res, userData, 'Log in successfully')
    } catch (error) {
      next(error)
    }
  }

  async logOut(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const deleteRefreshToken = await UserService.logOutUser(refreshToken)
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')

      return res.json({ success: true, message: 'Log out successfully' }).status(200)
    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await UserService.updateRefreshToken(refreshToken)

      return TokenService.handleSetResponse(res, userData, 'Refresh successful')
    } catch (error) {
      next(error)
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const user = await UserService.getUser(req.userId)

      return res.json({ success: true, message: 'Success', user })
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
