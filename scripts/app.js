// const css = require('../styles/app.scss') // eslint-disable-line
const config = require('./config')
const firebase = require('firebase')

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

    const element = document.getElementById('queue1')
    element.innerHTML = `
        <div class="col-md-1 d-flex justify-content-center align-items-center">
          <p class="element queueNum">${requestID}</p>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <p class="element name">${name}</p>
        </div>
        <div class="col-md-6 d-flex align-items-center">
          <p class="element topic">${request}</p>
        </div>
        <div class="col-md-2 d-flex align-items-center justify-content-center">
          <p class="element resolve"><i class="fa fa-check-circle" aria-hidden="true"></i></p>
        </div>
      `
  })
  // console.log(requests)
}

function getAllRequests() {
  database.ref('requests/').once('value').then(snapshot => {
    let result = snapshot.val()
    result.forEach(function(item) {
      // console.log(item)
      const newListItem = document.createElement("LI")
      newListItem.className = "row entry py-2"
      newListItem.innerHTML = `
      <div class="col-md-1 d-flex justify-content-center align-items-center">
        <p class="element queueNum">${item._id}</p>
      </div>
      <div class="col-md-3 d-flex align-items-center">
        <p class="element name">${item.name}</p>
      </div>
      <div class="col-md-6 d-flex align-items-center">
        <p class="element topic">${item.question}</p>
      </div>
      <div class="col-md-2 d-flex align-items-center justify-content-center">
        <p class="element resolve"><i class="fa fa-check-circle" aria-hidden="true"></i></p>
      </div>
      `
      document.getElementById('queue').appendChild(newListItem)
    })
  })
}

getAllRequests()


// getRequests(3)
