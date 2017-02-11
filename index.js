'use strict'

const enigma = require('./enigma')
const config = require('./config')
const util = require('util')

const co = require('bluebird-co').co

const fs = require('fs')
const Hapi = require('hapi')
const path = require('path')
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport(config.nodemailer.transporter)

const server = new Hapi.Server()
server.connection(config.server.api)

server.route({
  method: 'POST',
  path: '/email',
  handler: function (request, reply) {

    let mailOptions = {
      from: util.format('"%s" <carlosleelibros@gmail.com>', request.payload.fromName), // sender address
      to: request.payload.to,
      subject: request.payload.subject, // Subject line
      text: request.payload.text, // plain text body
      html: request.payload.html // html body
    }

    co(function * () {
      reply()
      let p = request.payload
      let obj = {
        to: p.to,
        subject: p.subject,
        passthrough: p.passthrough
      }
      let slug = yield enigma.encrypt(obj)
      let imgTag = yield enigma.createImgTag(slug)
      mailOptions.html += imgTag
      let info = yield  transporter.sendMail(mailOptions)
      return info
    })
      .then((info) => {
        console.log(info)
      })
      .catch(console.error)
  }
})

server.route({
  method: 'GET',
  path: '/{slug}.png',
  handler: function (request, reply) {
    co(function * () {
      let obj = yield enigma.decodeSlug(request.params.slug)
      console.log(obj)
      return obj
    })
      .then((obj) => {
        reply(fs.createReadStream(path.join(__dirname, 'sneaker.png')))
      })
  }
})

server.route({
  method: 'GET',
  path: '/example',
  handler: function (request, reply) {
    return reply(fs.createReadStream(path.join(__dirname, 'example', 'index.html')))
  }
})

server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Server running at:', server.info.uri)
})