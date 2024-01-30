import ApiError from '#exceptions/api-error.js'
import TokenService from '#service/token-service.js'

export default async function authMiddleware(req, res, next) {
  try {
    const { accessToken } = req.cookies

    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const isAccessTokenValid = await TokenService.validateAccessToken(accessToken)

    if (!isAccessTokenValid) {
      return next(ApiError.UnauthorizedError())
    }

    req.userId = isAccessTokenValid.payload
    return next()
  } catch (error) {
    return next(ApiError.UnauthorizedError())
  }
}
