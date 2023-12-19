import jwt from 'jsonwebtoken'
import { tokenConfig } from '#data/config.js'
import UserToken from '#models/UserToken.js'

const { accessTokenExpires, accessTokenKey, refreshTokenExpires, refreshTokenKey } = tokenConfig

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

  async handleSetResponse(res, userData, message) {
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

    return (
      res
        // я тепер передаю тут і токени
        .json({ success: true, message: message, user, accessToken, refreshToken })
        .status(200)
    )
  }
}

export default new TokenService()
