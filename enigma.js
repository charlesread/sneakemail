'use strict'

const key = 'd9vu98fewf0sd9c9uds9fj923hr813h'

const config = require('./config')

const util = require('util')
const co = require('bluebird-co').co
const crypt = require('simple-encryptor')(key)

let enigma = {}

enigma.encrypt = function (obj) {
  return Promise.resolve(encodeURIComponent(crypt.encrypt(obj)))
}

enigma.createImgTag = function (slug) {
  return co(function * () {
    const url = util.format('http://%s:%s/%s.png', config.server.api.host, config.server.api.port, slug)
    const imgTag = util.format('<img src="%s" />', url)
    return imgTag
  })
}

enigma.decodeSlug = function (slug) {
  return Promise.resolve(crypt.decrypt(decodeURIComponent(slug)))
}

module.exports = enigma