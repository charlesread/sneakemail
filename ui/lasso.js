'use strict'

const path = require('path')
const baseDir = path.resolve(path.join(__dirname, '..', '..', '..'))
const lasso = require('lasso')

console.log(baseDir)

lasso.configure({
  outputDir: path.join(baseDir, 'static'),
  plugins: [
    'lasso-marko'
  ]
}, baseDir)