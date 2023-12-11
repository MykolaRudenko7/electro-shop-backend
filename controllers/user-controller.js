import { validationResult } from 'express-validator'
import { electroShopClientAddress } from '../data/config.js'
import UserService from '../service/user-service.js'
import ApiError from '../exceptions/api-error.js'

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

      const { accessToken, refreshToken, user } = userData

      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 15 * 60 * 1000,
        })

      return res.json({ success: true, message: 'Registration was successful', user }).status(200)
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

      const { accessToken, refreshToken, user } = userData

      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 15 * 60 * 1000,
        })
      return res.json({ success: true, message: 'Log in successfully', user }).status(200)
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
      const { newAccessToken, newRefreshToken, user } = userData
      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 15 * 60 * 1000,
        })

      return res.json(user).status(200)
    } catch (error) {
      next(error)
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getUsers()

      return res.json(users)
    } catch (error) {
      next(error)
    }
  }

  async getUserInfo(req, res, next) {
    const { refreshToken } = req.cookies

    try {
      const user = await UserService.getUser(refreshToken)

      return res.json(user)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()

// return res.status(500).json({ success: false, error: error.message })
