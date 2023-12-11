import ApiError from '../exceptions/api-error.js'
import TokenService from '../service/token-service.js'

export default async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    console.log('accessToken', accessToken)
    const isAccessTokenValid = await TokenService.validateAccessToken(accessToken)
    console.log('accessTokenValid', !!isAccessTokenValid)

    if (!isAccessTokenValid) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = isAccessTokenValid
    next()
  } catch (error) {
    return next(ApiError.UnauthorizedError())
  }
}
