// const css = require('../styles/app.scss') // eslint-disable-line
const config = require('./config').config
// const uiconfig = require('./config').uiconfig
// console.log(uiconfig)
const firebase = require('firebase')
// const firebaseui = require('firebaseui')

firebase.initializeApp(config)
// let user = firebase.auth().currentUser
let database = firebase.database()

function getAllRequests () {
  database.ref('requests/').on('value', snapshot => {
    let result = snapshot.val()
    const ids = Object.keys(result)
    const queue = document.getElementById('queue')
    queue.innerHTML = ''
    const openQuestions = ids.filter(id => !result[id].resolved)
    openQuestions.forEach((id, index) => {
      const item = result[id]
      queue.appendChild(createNewListItem(id, index + 1, item.name, item.question))
    })
  })
}

function createNewListItem (id, index, name, question) {
  const newListItem = document.createElement('LI')
  newListItem.id = id
  newListItem.className = 'row entry py-2'
  newListItem.innerHTML = `
    <div class="col-md-1 d-flex justify-content-center align-items-center">
      <p class="element queueNum">${index}</p>
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

function submitMessage (messageContent, userName) {
  let uid = Date.now() + userName
  database.ref('requests/' + uid).set({
    _id: uid,
    name: userName,
    question: messageContent,
    resolved: false
  }).then(function () {
    // popup the success

  }).catch(function (error) {
    console.error(error)
  })
}

function markAsResolved (id, resolutionMessage) {
  database.ref('requests/' + id).update({
    resolved: true
  }).then(function () {
    database.ref('requests/' + id).once('value', function (snapshot) {
      database.ref('archive/' + id).set(snapshot.val())
      database.ref('archive/' + id).update({'resolution': resolutionMessage})
    }).then(function () {
      // database.ref('requests/' + id).set(null)
    })
  }).catch(function (err) {
    console.error(err)
  })
}

function displayArchivedQuestions () {
  database.ref('archive/').on('value', function (snapshot) {
    let result = snapshot.val()
    const ids = Object.keys(result)
    const archive = document.getElementById('archive')
    archive.innerHTML = ''
    ids.forEach((id, index) => {
      const item = result[id]
      archive.appendChild(createNewListItem(id, index + 1, item.name, item.question))
    })
  })
}

// writeUserData(2, "Stan N.", 'stan@example.com')

if (window.route === 'index') {
  // do login page stuff

} else if (window.route === 'askify') {
  let userInfo = JSON.parse(window.localStorage.getItem('user'))
  const submitButton = document.getElementById('add-request')
  const messageTextField = document.getElementById('message-text')
  const greetingDiv = document.getElementById('greeting')

  greetingDiv.textContent = `Hello, ${userInfo.fname}!`

  submitButton.addEventListener('click', e => {
    let messageText = messageTextField.value
    if (messageText !== '') {
      submitMessage(messageText, userInfo.fname)
      messageTextField.value = ''
    }
  })
  getAllRequests()

  markAsResolved('1507242473577Kat', 'Iceland beard hoodie, fashion axe four loko blog typewriter kitsch master cleanse scenester.')
} else if (window.route === 'archive') {
  displayArchivedQuestions()
}
