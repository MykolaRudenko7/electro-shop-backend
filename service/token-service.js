import jwt from 'jsonwebtoken'
import {
  accessTokenExpires,
  accessTokenKey,
  refreshTokenExpires,
  refreshTokenKey,
} from '../data/config.js'
import UserToken from '../models/UserToken.js'

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign({ payload, access: true }, accessTokenKey, {
      expiresIn: accessTokenExpires,
    })

    const refreshToken = jwt.sign({ payload, refresh: true }, refreshTokenKey, {
      expiresIn: refreshTokenExpires,
    })

    return { accessToken, refreshToken }
  }

  async saveRefreshToken(userId, refreshToken) {
    const userRefreshToken = await UserToken.findOne({ user: userId })

    if (userRefreshToken) {
      userRefreshToken.refreshToken = refreshToken

      return userRefreshToken.save()
    }
    const newRefreshToken = await UserToken.create({ user: userId, refreshToken })

    return newRefreshToken
  }

  async removeRefreshToken(refreshToken) {
    const tokenData = await UserToken.deleteOne({ refreshToken })

    return tokenData
  }

  async validateAccessToken(accessToken) {
    try {
      const isAccessTokenVerify = jwt.verify(accessToken, accessTokenKey)

      return isAccessTokenVerify
    } catch (error) {
      return null
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const isRefreshTokenVerify = jwt.verify(refreshToken, refreshTokenKey)

      return isRefreshTokenVerify
    } catch (error) {
      return null
    }
  }

  async findRefreshToken(refreshToken) {
    const isRefreshToken = await UserToken.findOne({ refreshToken })

    return isRefreshToken
  }
}

export default new TokenService()
