'use strict'

const path = require('path')
const page = require(require.resolve(path.join(__dirname, 'template.marko')))

const route = {
  method: 'get',
  path: '/email',
  handler: function (req, reply) {
    reply(page.stream())
  }
}

module.exports = [route]