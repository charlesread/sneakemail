'use strict'

const path = require('path')

const api = require(path.join(__dirname, 'lib', 'api'))
const ui = require(path.join(__dirname, 'lib', 'ui'))

module.exports = {
  api,
  ui
}