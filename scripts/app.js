// const css = require('../styles/app.scss') // eslint-disable-line
const config = require('./config').config

const uiconfig = require('./config').uiconfig

console.log(uiconfig)

const firebase = require('firebase')
// const firebaseui = require('firebaseui')

firebase.initializeApp(config)
// let user = firebase.auth().currentUser

let database = firebase.database()

let name, request

function getRequests (requestID) {
  database.ref('requests/' + requestID).once('value').then(snapshot => {
    let result = snapshot.val()
    // console.log(snapshot.val())
    name = result.name
    request = result.question
    // console.log('name', name, 'request', request)

    const element = createNewListItem(requestID, name, request)
    document.getElementById('queue').appendChild(element)
  })
  // console.log(requests)
}

function getAllRequests () {
  database.ref('requests/').once('value').then(snapshot => {
    let result = snapshot.val()
    if (result.length > 1) {
      result.forEach(function (item) {
        document.getElementById('queue').appendChild(createNewListItem(item._id, item.name, item.question))
      })
    } else {
      const key = Object.keys(result)
      console.log(result[key])
      document.getElementById('queue').appendChild(createNewListItem(result[key]._id, result[key].name, result[key].question))
    }
  })
}

function createNewListItem (id, name, question) {
  const newListItem = document.createElement('LI')
  newListItem.className = 'row entry py-2'
  newListItem.innerHTML = `
    <div class="col-md-1 d-flex justify-content-center align-items-center">
      <p class="element queueNum">${id}</p>
    </div>
    <div class="col-md-3 d-flex align-items-center">
      <p class="element name">${name}</p>
    </div>
    <div class="col-md-6 d-flex align-items-center">
      <p class="element topic">${question}</p>
    </div>
    <div class="col-md-2 d-flex align-items-center justify-content-center">
      <p class="element resolve"><i class="fa fa-check-circle" aria-hidden="true"></i></p>
    </div>
    `
  return newListItem
}

// function writeUserData(userId, name, email) {
//   database.ref('users/' + userId).set({
//     username: name,
//     email: email
//   })
// }

function writeRequestData (requestId, name, question) {
  database.ref('requests/' + requestId).set({
    _id: requestId,
    name: name,
    question: question,
    resolved: false
  })
}

// writeUserData(2, "Stan N.", 'stan@example.com')

if (window.route === 'index') {
  // do login page stuff
} else if (window.route === 'askify') {
  getAllRequests()
  writeRequestData(5, 'Kat', 'Another silly request from Atom ')
  getRequests(5)
}
