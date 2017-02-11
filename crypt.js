'use strict'

const key = 'real secret keys should be long and random'

const crypt = require('simple-encryptor')(key)

module.exports = crypt