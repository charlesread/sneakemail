'use strict'

const path = require('path')
const page = require(require.resolve(path.join(__dirname, 'template.marko')))
const options = require(path.join(__dirname, '..', '..', '..', '..', 'config', 'config'))()

const route = {
  method: 'get',
  path: options.sneakemail.endpoints.ui.index,
  handler: function (req, reply) {
    reply(page.stream({emailPostEndpoint: options.sneakemail.endpoints.ui.emailPost}))
  }
}

module.exports = [route]