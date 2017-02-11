'use strict'

const ip = require('ip')

module.exports = {
  server: {
    ui: {
      host: ip.address(),
      port: 80
    },
    api: {
      host: ip.address(),
      port: 3000
    }
  },
  nodemailer: {
    transporter: {
      service: 'Gmail',
      auth: {
        user: '',
        pass: ''
      }
    }
  }
}