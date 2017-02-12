'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const Hapi = require('hapi')
const nodemailer = require('nodemailer')
const co = require('bluebird-co').co

const Api = {

  server: new Hapi.Server(),

  transporter: undefined,

  init: function (options) {
    options = require(path.join(__dirname, '..', 'config', 'config'))(options)
    const enigma = require(path.join(__dirname, 'enigma'))
    let that = this
    return new Promise((resolve, reject) => {
      try {
        this.transporter = nodemailer.createTransport(options.transporter)
        this.server.connection(options.server.api)
        this.server.route({
          method: 'POST',
          path: '/email',
          handler: (request, reply) => {
            let mailOptions = {
              from: util.format('"%s" <%s>', request.payload.fromName, options.sneaker.fromAddress),
              to: request.payload.to,
              subject: request.payload.subject,
              text: request.payload.text,
              html: request.payload.html
            }
            co(function *() {
              reply()
              let p = request.payload
              let obj = {
                to: p.to,
                subject: p.subject,
                passthrough: p.passthrough
              }
              let slug = yield enigma.encrypt(obj)
              mailOptions.html += yield enigma.createImgTag(slug)
              return yield that.transporter.sendMail(mailOptions)
            })
              .then((info) => {
                console.log(info)
              })
              .catch(console.error)
          }
        })
        this.server.route({
          method: 'GET',
          path: '/{slug}.css',
          // path: '/{slug}.png',
          handler: function (request, reply) {
            co(function *() {
              return yield enigma.decodeSlug(request.params.slug)
            })
              .then((obj) => {
                options.openCallback(obj)
                reply()
                // reply(fs.createReadStream(path.join(__dirname, '..', 'static', 'sneaker.png')))
              })
              .catch(reject)
          }
        })
      } catch (err) {
        return reject(err)
      }
      resolve(true)
    })
  },

  start: function () {
    return new Promise((resolve, reject) => {
      this.server.start((err) => {
        if (err) {
          return reject(err)
        }
        resolve(true)
      })
    })
  }

}

module.exports = Api