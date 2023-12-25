import ApiError from '#exceptions/api-error.js'

export default function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ success: false, error: err.message, errors: err.errors })
  }

  return res.status(500).json({ success: false, message: 'Unexpected error' })
}
