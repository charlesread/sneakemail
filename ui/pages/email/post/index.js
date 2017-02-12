'use strict'

const path = require('path')
const request = require('request')

const page = require(require.resolve(path.join(__dirname, 'template.marko')))
const api = require(path.join(__dirname, '..', '..', '..', '..', 'lib', 'api'))
const config = require(path.join(__dirname, '..', '..', '..', '..', 'config', 'config'))()

const route = {
  method: 'post',
  path: `/${path.basename(path.join(__dirname, '..'))}`,
  handler: function (req, reply) {
    const emailPostUrl = api.server.info.uri + config.sneakemail.endpoints.email
    console.log(req.payload)
    request(
      {
        method: 'post',
        url: emailPostUrl,
        json: true,
        body: req.payload
      },
      (err, http, body) => {
        if (err) {
          reply(err.message)
          throw err
        }
        reply(page.stream(body))
      }
    )
  }
}

module.exports = [route]