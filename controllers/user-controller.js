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

  //   // вихід
  //   async logOut(req, res, next) {
  //     try {
  //       const userToken = await UserToken.findOne({ token: req.cookies.refreshToken })

  //       if (!userToken) {
  //         return res.status(200).json({ success: true, message: 'Logged Out Successfully' })
  //       }

  //       await userToken.deleteOne()

  //       res
  //         .status(200)
  //         .json({ error: false, message: 'Logged Out Successfully' })
  //         .cookie('refreshToken', '', {
  //           httpOnly: true,
  //           secure: true,
  //           sameSite: isProduction ? 'strict' : 'lax',
  //           maxAge: '',
  //           expires: new Date(),
  //         })
  //         .cookie('accessToken', '', {
  //           httpOnly: true,
  //           secure: true,
  //           sameSite: isProduction ? 'strict' : 'lax',
  //           maxAge: '',
  //           expires: new Date(),
  //         })
  //     } catch (err) {
  //           next(error)

  //     }
  //   }

  //   // оновлення токену
  //   async refresh(req, res, next) {
  //     try {
  //       const { tokenDetails } = await verifyRefreshToken(req.cookies.refreshToken)

  //       const payload = { _id: tokenDetails._id }
  //       const accessToken = jwt.sign(payload, accessTokenKey, {
  //         expiresIn: 15 * 60 * 1000,
  //       })

  //       res
  //         .cookie('accessToken', accessToken, {
  //           httpOnly: true,
  //           secure: true,
  //           sameSite: isProduction ? 'strict' : 'lax',
  //           maxAge: 15 * 60 * 1000,
  //         })
  //         .status(200)
  //         .json({
  //           error: false,
  //           accessToken,
  //           message: 'Access token created successfully',
  //         })
  //     } catch (err) {
  //             next(error)

  //     }
  //   }

  //   // отримання користувача
  //   async getUser(req, res, next) {
  //     try {
  //       const accessToken = req.cookies.accessToken

  //       if (!accessToken) {
  //         return res.status(401).json({ success: false, message: 'No access token provided' })
  //       }

  //       let payload
  //       try {
  //         payload = jwt.verify(accessToken, accessTokenKey)
  //       } catch (err) {
  //         return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  //       }

  //       const user = await User.findOne({ _id: payload._id })

  //       if (!user) {
  //         return res.status(400).json({ success: false, message: 'User does not exist' })
  //       }

  //       return res.json({
  //         success: true,
  //         accessToken,
  //         user,
  //       })
  //     } catch (error) {
  //             next(error)

  //     }
  //   }
}

export default new UserController()

// return res.status(500).json({ success: false, error: error.message })
