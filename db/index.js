const firebase = require('firebase')
const config = require('./config')

firebase.initializeApp(config)
let database = firebase.database()

module.exports = database