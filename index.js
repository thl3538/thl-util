'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/thl-util.cjs.prod.js')
} else {
  module.exports = require('./dist/thl-util.cjs.bundle.js')
}
