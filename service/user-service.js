import { v4 } from 'uuid'
import bcrypt, { compare } from 'bcrypt'
import TokenService from './token-service.js'
import ApiError from '../exceptions/api-error.js'
import MailService from './mail-service.js'
import { electroShopBackendAddress, salt } from '../data/config.js'
import User from '../models/User.js'

class UserService {
  async signUpUser(name, email, password, mobileNumber) {
    const userExistsByEmail = await User.findOne({ email })
    const userExistsByPhone = await User.findOne({ mobileNumber })

    if (userExistsByEmail || userExistsByPhone) {
      throw ApiError.BadRequest('User with this email or phone already exists')
    }

    const quantitySalt = await bcrypt.genSalt(Number(salt))
    const hashPassword = await bcrypt.hash(password, quantitySalt)

    const activationLink = v4()
    const fullActivationLink = `${electroShopBackendAddress}/api/activate/${activationLink}`

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      mobileNumber,
      loginAttempts: 0,
      lockUntil: null,
      activationLink,
    })

    await MailService.sendActivationMail(email, fullActivationLink)

    const { accessToken, refreshToken } = await TokenService.generateTokens(
      newUser._id,
      newUser.email,
    )

    await TokenService.saveRefreshToken(newUser._id, refreshToken)

    return { accessToken, refreshToken, user: newUser }
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink })

    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link')
    }

    user.isActivated = true
    await user.save()
  }

  async signInUser(email, password) {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      throw ApiError.BadRequest('User with email does not exist')
    }

    if (user.lockUntil === Infinity) {
      throw ApiError.BadRequest('Account is locked. Please contact support.')
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000))

      throw ApiError.BadRequest(
        `Too many login attempts. Please try again after ${minutesLeft} minutes.`,
      )
    }

    const isPasswordCorrect = await compare(password, user.password)

    if (!isPasswordCorrect) {
      user.loginAttempts += 1

      if (user.loginAttempts >= 5 && user.lockUntil === null) {
        user.lockUntil = Date.now() + 3 * 60 * 1000
      } else if (user.loginAttempts >= 10) {
        user.lockUntil = Infinity
      }
      await user.save()
      const remainingAttempts = 10 - user.loginAttempts

      throw ApiError.BadRequest(
        `Password is incorrect. Remaining attempts: ${remainingAttempts + 1}`,
      )
    }

    user.loginAttempts = 0
    user.lockUntil = null
    await user.save()

    const { accessToken, refreshToken } = await TokenService.generateTokens(user._id, user.email)

    await TokenService.saveRefreshToken(user._id, refreshToken)

    return { accessToken, refreshToken, user }
  }

  async logOutUser(refreshToken) {
    const token = await TokenService.removeRefreshToken(refreshToken)

    return token
  }

  async updateRefreshToken(token) {
    if (!token) {
      throw ApiError.UnauthorizedError()
    }
    const isRefreshTokenValid = await TokenService.validateRefreshToken(token)
    const isRefreshTokenFromDb = await TokenService.findRefreshToken(token)

    if (!isRefreshTokenValid || !isRefreshTokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await User.findById(isRefreshTokenValid._id)
    const { accessToken, refreshToken } = await TokenService.generateTokens(user._id, user.email)
    await TokenService.saveRefreshToken(user._id, refreshToken)

    return { accessToken, refreshToken, user }
  }
}

export default new UserService()
