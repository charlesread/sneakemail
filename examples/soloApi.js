'use strict'

const path = require('path')
const co = require('bluebird-co').co

const Sneakemail = require('sneakemail')
const api = Sneakemail.api
const ui = Sneakemail.ui

const options = {
  // the api object gets passed DIRECTLY to the Hapi `server.connection()` method
  server: {
    api: {
      port: 3000
    }
  },
  // these values need to be entered accodeing to `node-mailer`: https://nodemailer.com/smtp/well-known,
  // this object is passed DIRECTLY to nodemailer.createTransport(), so do whatever you like according to what
  // `node-mailer` does, you, of course, don't have to use a "well-known" service, as this example does
  transporter: {
    service: 'Mailjet',
    auth: {
      user: '',
      pass: ''
    }
  },
  // this becomes the from address in the email that is sent
  sneakemail: {
    fromAddress: 'email@gmail.com',
    endpoints: {
      api: {
        emailPost: '/email' //default
      },
      ui: {
        index: '/', //default
        emailPost: '/email' //default
      }
    }
  },
  // this is the function that gets called when somebody opens an email, its argument is an object that contains the
  // `to`, `subject`, and `passthrough` objects that were contained in the body of the HTTP POST to `/email`
  openCallback: function (obj) {
    console.log(obj)
  }
}

co(function *() {

  yield api.init(options)
  yield ui.init(options)

  // add some more routes if you so desire
  api.server.route({
    method: 'get',
    path: '/',
    handler: (req, reply) => {
      reply('Welcome to the Sneakemail API')
    }
  })

  yield api.start()
  yield ui.start()

})
  .then(() => {
    console.log('api started at ', api.server.info.uri)
    console.log('ui started at ', ui.server.info.uri)
    // lets look at the route table just to confirm that our routes are regisred
    console.log('api routes:')
    api.server.table()[0].table.map((t) => {
      console.log(' route %s [%s] is registered: %s%s', t.path, t.method, api.server.info.uri, t.path)
    })
    console.log('ui routes:')
    ui.server.table()[0].table.map((t) => {
      console.log(' route %s [%s] is registered: %s%s', t.path, t.method, ui.server.info.uri, t.path)
    })
  })
  .catch(console.error)