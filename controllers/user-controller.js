import { electroShopClientAddress } from '../data/config.js'
import UserService from '../service/user-service.js'

class UserController {
  async signUp(req, res, next) {
    try {
      // витягую дані з форми реєстрації
      const { name_newUser, email_newUser, password_newUser, mobileNumber_newUser } = await req.body

      // передаю ці поля і зберігаю користувача. Повертаю токени і збереженого користувача
      const userData = await UserService.registration(
        name_newUser,
        email_newUser,
        password_newUser,
        mobileNumber_newUser,
      )

      // витягую токени
      const { accessToken, refreshToken, user } = userData

      // встановлюю токени
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
      console.log('error', error)
      return res.status(500).json({ success: false, error: error.message })
    }
  }

  async activateUser(req, res, next) {
    try {
      const activationLink = req.params.link
      await UserService.activate(activationLink)
      return res.redirect(electroShopClientAddress)
    } catch (error) {
      console.log(error)
    }
  }
  //   // вхід
  //   async signIn(req, res, next) {
  //     try {
  //       const { email_signIn, password_signIn } = await req.body

  //       if (!email_signIn) {
  //         return res.status(400).json({ success: false, error: 'Email is required' })
  //       }

  //       if (!password_signIn) {
  //         return res.status(400).json({ success: false, error: 'Password is required' })
  //       }

  //       const user = await User.findOne({ email: email_signIn }).select('+password')

  //       if (!user) {
  //         return res.status(400).json({ success: false, error: 'User with email does not exist' })
  //       }

  //       if (user.lockUntil === Infinity) {
  //         return res
  //           .status(403)
  //           .json({ success: false, error: 'Account is locked. Please contact support.' })
  //       }

  //       if (user.lockUntil && user.lockUntil > Date.now()) {
  //         const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000))

  //         return res.status(403).json({
  //           success: false,
  //           error: `Too many login attempts. Please try again after ${minutesLeft} minutes.`,
  //         })
  //       }

  //       const isPasswordCorrect = await compare(password_signIn, user.password)

  //       if (!isPasswordCorrect) {
  //         user.loginAttempts += 1

  //         if (user.loginAttempts >= 5 && user.lockUntil === null) {
  //           user.lockUntil = Date.now() + 3 * 60 * 1000
  //         } else if (user.loginAttempts >= 10) {
  //           user.lockUntil = Infinity
  //         }

  //         await user.save()
  //         const remainingAttempts = 10 - user.loginAttempts

  //         return res.status(401).json({
  //           success: false,
  //           error: `Password is incorrect. Remaining attempts: ${remainingAttempts + 1}`,
  //         })
  //       }

  //       user.loginAttempts = 0
  //       user.lockUntil = null
  //       await user.save()

  //       const { accessToken, refreshToken } = await generateTokens(user._id)

  //       return res
  //         .cookie('refreshToken', refreshToken, {
  //           httpOnly: true,
  //           secure: true,
  //           sameSite: isProduction ? 'strict' : 'lax',
  //           maxAge: 30 * 24 * 60 * 60 * 1000,
  //         })
  //         .cookie('accessToken', accessToken, {
  //           httpOnly: true,
  //           secure: true,
  //           sameSite: isProduction ? 'strict' : 'lax',
  //           maxAge: 15 * 60 * 1000,
  //         })
  //         .status(201)
  //         .json({
  //           success: true,
  //           message: 'Log in successfully',
  //           user,
  //         })
  //     } catch (error) {
  //       return res.status(500).json({ success: false, error: error.message })
  //     }
  //   }

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
  //       res.status(500).json({ error: true, message: 'Internal Server Error' })
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
  //       res.status(400).json(err)
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
  //       return res.status(500).json({ success: false, message: error.message })
  //     }
  //   }
}

export default new UserController()
