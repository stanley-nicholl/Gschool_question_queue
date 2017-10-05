// const css = require('../styles/app.scss') // eslint-disable-line
const config = require('./config').config

const uiconfig = require('./config').uiconfig

console.log(uiconfig)

const firebase = require('firebase')
// const firebaseui = require('firebaseui')

firebase.initializeApp(config)
// let user = firebase.auth().currentUser

let database = firebase.database()

// let name, request

// const requestsRef = database.ref('requests/')
// requestsRef.on('value', snapshot => {
//   let result = snapshot.val()
//   const ids = Object.keys(result)
//   ids.forEach(id => {
//     const item = result[id]
//     document.getElementById('queue').innerHTML = ""
//     document.getElementById('queue').appendChild(createNewListItem(item._id, item.name, item.question))
//   })
// })

// function getRequests (requestID) {
//   database.ref('requests/' + requestID).on('value', snapshot => {
//     let result = snapshot.val()
//     name = result.name
//     request = result.question
//     const element = createNewListItem(requestID, name, request)
//     document.getElementById('queue').appendChild(element)
//   })
// }

function getAllRequests () {
  database.ref('requests/').on('value', snapshot => {
    let result = snapshot.val()
    const ids = Object.keys(result)
    const queue = document.getElementById('queue')
    queue.innerHTML = ''
    ids.forEach(id => {
      const item = result[id]
      queue.appendChild(createNewListItem(item._id, item.name, item.question))
    })
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

// function writeRequestData (requestId, name, question) {
//   database.ref('requests/' + requestId).set({
//     _id: requestId,
//     name: name,
//     question: question,
//     resolved: false
//   })
// }

// writeUserData(2, "Stan N.", 'stan@example.com')

if (window.route === 'index') {
  // do login page stuff
} else if (window.route === 'askify') {
  getAllRequests()
  // writeRequestData(5, 'Kat', 'Another silly request from Atom ')
  // getRequests(5)
}
