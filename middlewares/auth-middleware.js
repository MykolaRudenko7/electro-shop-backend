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

    const isAccessTokenValid = await TokenService.validateAccessToken(accessToken)

    if (!isAccessTokenValid) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = isAccessTokenValid
    next()
  } catch (error) {
    return next(ApiError.UnauthorizedError())
  }
}
