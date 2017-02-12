'use strict'

const path = require('path')
const pagesPath = path.join(__dirname, 'pages')
const dir = require('node-dir')

require('marko/node-require').install()
require('marko/compiler').defaultOptions.writeToDisk = false

let routes = []

function getRouteFiles () {
  return new Promise((resolve, reject) => {
    dir.files(pagesPath, (err, files) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })
}

function concatRoutes (files) {
  return new Promise((resolve, reject) => {
    files = files.filter((file) => {
      return path.basename(file) === 'index.js'
    })
    for (let i = 0; i < files.length; i++) {
      routes = routes.concat(
        require(files[i])
      )
      if (i === files.length - 1) {
        resolve(routes)
      }
    }
  })
}
module.exports.getRoutes = function () {
  return getRouteFiles()
    .then(concatRoutes)
}