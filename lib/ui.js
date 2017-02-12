'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const Hapi = require('hapi')
const co = require('bluebird-co').co
const routes = require(path.join(__dirname, '..', 'ui', 'routes'))

const Ui = {

  server: new Hapi.Server(),

  init: function (options) {
    options = require(path.join(__dirname, '..', 'config', 'config'))(options)
    let that = this
    return new Promise((resolve, reject) => {
      try {
        this.server.connection(options.server.ui)
        // Prevents Marko from writing its generated JS to .marko.js files
        require('marko/compiler').defaultOptions.writeToDisk = false
        // Let's us require Marko templates like modules, e.g. `require('./template.marko')`
        require('marko/node-require').install()
        // Configures the singleton instance of Lasso
        require(path.join(__dirname, '..', 'ui', 'lasso'))

        that.server.register(require('inert'), (err) => {
            if (err) {
              throw err
            }
            that.server.route({
              method: 'GET',
              path: '/static/{param*}',
              handler: {
                directory: {
                  path: 'static'
                }
              }
            })
          }
        )

        setImmediate(() => {
          routes.getRoutes()
            .then((r) => {
              that.server.route(r)
              resolve(true)
            })
        })

      } catch (err) {
        return reject(err)
      }
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

module.exports = Ui