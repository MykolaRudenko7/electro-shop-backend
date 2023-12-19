import { body, validationResult } from 'express-validator'

export const userValidationRules = () => {
  return [
    body('name_newUser').isLength({ min: 4, max: 20 }),
    body('email_newUser').isEmail(),
    body('password_newUser').isLength({ min: 6, max: 30 }),
    body('mobileNumber_newUser').isLength({ min: 10, max: 13 }),
  ]
}

export const validateNewUser = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  return next()
}
