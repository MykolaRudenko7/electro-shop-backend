import bcrypt from 'bcrypt'
import { electroShopBackendAddress, salt } from '../data/config.js'
import User from '../models/User.js'
import { v4 } from 'uuid'
import MailService from './mail-service.js'
import TokenService from './token-service.js'

class UserService {
  async registration(name, email, password, mobileNumber) {
    try {
      // шукаю чи вже є такий юзер в базі
      const userExistsByEmail = await User.findOne({ email })
      const userExistsByPhone = await User.findOne({ mobileNumber })

      // якщо є, то повертаю помилку
      if (userExistsByEmail || userExistsByPhone) {
        throw new Error('User with this email or phone already exists')
      }

      // додаю 'сіль' і шифрую пароль
      const quantitySalt = await bcrypt.genSalt(Number(salt))
      const hashPassword = await bcrypt.hash(password, quantitySalt)

      // лінка для активації
      const activationLink = v4()
      const fullActivationLink = `${electroShopBackendAddress}/api/activate/${activationLink}`

      // створюю юзера в базі
      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        mobileNumber,
        loginAttempts: 0,
        lockUntil: null,
        activationLink,
      })

      // викликаю ф-цію для відправки листа для активації
      await MailService.sendActivationMail(email, fullActivationLink)

      //генерую 2 токени
      const { accessToken, refreshToken } = await TokenService.generateTokens(
        newUser._id,
        newUser.email,
      )

      // зберігаю рефреш токен в базі
      await TokenService.saveRefreshToken(newUser._id, refreshToken)

      return { accessToken, refreshToken, user: newUser }
    } catch (error) {
      console.log(error)
    }
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink })

    if (!user) {
      console.log('User not found')
    }

    user.isActivated = true
    await user.save()
  }
}
export default new UserService()
