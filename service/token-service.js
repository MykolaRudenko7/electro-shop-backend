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
    //  роблю accessToken
    const accessToken = jwt.sign({ payload, access: true }, accessTokenKey, {
      expiresIn: accessTokenExpires,
    })

    // роблю refreshToken
    const refreshToken = jwt.sign({ payload, refresh: true }, refreshTokenKey, {
      expiresIn: refreshTokenExpires,
    })

    return { accessToken, refreshToken }
  }

  async saveRefreshToken(userId, refreshToken) {
    const userRefreshToken = await UserToken.findOne({ user: userId })

    // якщо такий токен вже є, то замінюємо його з новим рефреш токеном
    if (userRefreshToken) {
      userRefreshToken.refreshToken = refreshToken
      return userRefreshToken.save()
    }
    // інакше створюю новий рефреш токен і зберігаю
    const newRefreshToken = await UserToken.create({ user: userId, refreshToken })
    return newRefreshToken
  }
}

export default new TokenService()
