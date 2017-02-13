'use strict'

const ip = require('ip')
const deepAssign = require('deep-assign')

let config

const defaultConfig = {
  server: {
    ui: {
      host: ip.address(),
      port: 8080
    },
    api: {
      host: ip.address(),
      port: 3000
    }
  },
  transporter: {
    service: '',
    auth: {
      user: '',
      pass: ''
    }
  },
  sneakemail: {
    fromAddress: 'noreply@domain.com',
    endpoints: {
      api: {
        emailPost: '/email'
      },
      ui: {
        emailPost: '/email',
        index: '/'
      }
    }
  },
  openCallback: function (obj) {
    console.log(obj)
  }
}

module.exports = function (options) {
  if (!config) {
    config = deepAssign({}, defaultConfig, options)
  }
  return config
}
