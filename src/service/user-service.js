import { v4 } from 'uuid'
import bcrypt from 'bcryptjs'
import ApiError from '#exceptions/api-error.js'
import { salt } from '#data/config.js'
import appEndpoints from '#data/appEndpoints.js'
import User from '#models/User.js'
import MailService from './mail-service.js'
import TokenService from './token-service.js'

const { backend } = appEndpoints
const { compare } = bcrypt

class UserService {
  async signUpUser(name, email, password, mobileNumber) {
    const doesUserExistByEmail = await User.findOne({ email })
    const doesUserExistByPhone = await User.findOne({ mobileNumber })

    if (doesUserExistByEmail || doesUserExistByPhone) {
      throw ApiError.BadRequest('User with this email or phone already exists')
    }

    const quantitySalt = await bcrypt.genSalt(Number(salt))
    const hashPassword = await bcrypt.hash(password, quantitySalt)

    const activationLink = v4()
    const fullActivationLink = `${backend}/api/activate/${activationLink}`

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
    const user = await this.getUserByEmail(email)

    if (!user) {
      throw ApiError.BadRequest('User with email does not exist')
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000))
      throw ApiError.BadRequest(
        `Too many login attempts. Please try again after ${minutesLeft} minutes.`,
      )
    }

    await this.handleIncorrectPassword(user, password)
    await this.resetLockAndLoginAttempts(user)

    const { accessToken, refreshToken } = await TokenService.generateTokens(user._id, user.email)

    await TokenService.saveRefreshToken(user._id, refreshToken)

    return { accessToken, refreshToken, user }
  }

  async handleInvalidUser(user) {
    if (!user) {
      throw ApiError.BadRequest('User with this email does not exist')
    }
  }

  async getUserByEmail(email) {
    return User.findOne({ email }).select('+password')
  }

  async handleIncorrectPassword(user, password) {
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
  }

  async resetLockAndLoginAttempts(user) {
    user.loginAttempts = 0
    user.lockUntil = null
    await user.save()
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

    const user = await User.findById(isRefreshTokenValid.payload)
    const { accessToken, refreshToken } = await TokenService.generateTokens(user._id, user.email)
    await TokenService.saveRefreshToken(user._id, refreshToken)

    return { accessToken, refreshToken, user }
  }

  async getUser(id) {
    const user = await User.findById(id)

    return user
  }
}

export default new UserService()
