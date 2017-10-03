const css = require('../styles/app.scss') // eslint-disable-line
const config = require('./config')
const firebase = require('firebase')

firebase.initializeApp(config)
let user = firebase.auth().currentUser;

if(user) {
  console.log('Someone is signed in.')
} else {
  console.log('No one is currently signed in.')
}
