'use strict'

const path = require('path')
// this puts the baseUrl at the root of the actual project, not this module
const baseDir = path.resolve(path.join(__dirname, '..', '..', '..'))
const lasso = require('lasso')

lasso.configure({
  outputDir: path.join(baseDir, 'static'),
  plugins: [
    'lasso-marko'
  ]
}, baseDir)