import nodemailer from 'nodemailer'
import { appAddresses, nodemailerConfig } from '../data/config.js'

const { mailAddress, mailPassword, smprtHost, smprtPort } = nodemailerConfig
const { backend } = appAddresses

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: smprtHost,
      port: smprtPort,
      secure: false,
      auth: {
        user: mailAddress,
        pass: mailPassword,
      },
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: mailAddress,
      to,
      subject: `Account activation on ${backend}`,
      text: '',
      html: `
        <div>
          <h1>To activate your account, follow the link:</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    })
  }
}
export default new MailService()
