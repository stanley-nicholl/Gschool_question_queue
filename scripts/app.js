// const css = require('../styles/app.scss') // eslint-disable-line
const config = require('./config')
const firebase = require('firebase')

let username
firebase.initializeApp(config)
let database = firebase.database()

const templates = require('../templates')

function getAllRequests () {
  database.ref('requests/').on('value', snapshot => {
    let result = snapshot.val()
    const ids = Object.keys(result)
    const queue = document.getElementById('queue')
    const queueSpot = document.getElementById('queueSpot')
    let queueNum = 0

    queue.innerHTML = ''
    const openQuestions = ids.filter(id => !result[id].resolved)
    openQuestions.forEach((id, index) => {
      const item = result[id]
      if ((item.name === username) && (queueNum === 0)) {
        queueNum = index + 1
        queueSpot.textContent = queueNum
        window.localStorage.setItem('place', queueNum)
      }
      queue.appendChild(createNewListItem(id, index + 1, item.name, item.question))
      const answeredButton = document.getElementById(`${id}-answered`)
      const editButton = document.getElementById(`${id}-edit`)
      const questionText = document.getElementById(`${id}-question`)
      editButton.addEventListener('click', e => {
        if (editButton.textContent === 'Edit') {
          editButton.textContent = 'Save'
          const input = document.createElement('INPUT')
          input.style.width = '100%'
          input.id = `${id}-edit-input`

          input.value = item.question
          questionText.textContent = ''
          questionText.appendChild(input)

          answeredButton.classList.toggle('disabled')
        } else {
          editButton.textContent = 'Edit'
          answeredButton.classList.toggle('disabled')
          const input = document.getElementById(`${id}-edit-input`)

          database.ref('requests/' + id).update({
            question: input.value
          })
          questionText.textContent = input.value
        }
      })

      answeredButton.addEventListener('click', e => {
        if (answeredButton.textContent === 'Answered') {
          // do stuff
          answeredButton.textContent = 'Cancel'
          answeredButton.className = 'btn item-button btn-warning btn-sm my-2'

          const li = e.target.closest('LI')
          const form = document.createElement('FORM')
          form.id = `${id}-form`
          form.className = 'form-group d-flex row my-2'
          form.innerHTML = templates.form(id)
          li.appendChild(form)
          document.getElementById(`archive-${id}`).addEventListener('click', e => {
            const helperForm = document.getElementById(`helper-${id}`)
            const solutionForm = document.getElementById(`answer-${id}`)
            if ((solutionForm.value !== '') && (helperForm.value !== '')) {
              markAsResolved(id, solutionForm.value, helperForm.value)
            } else if (solutionForm.value === '') {
              window.alert('Please let us know what the solution was.')
            } else if (helperForm.value === '') {
              window.alert('Please let us know who helped you.')
            }
          })
        } else {
          answeredButton.textContent = 'Answered'
          answeredButton.className = 'btn item-button btn-success btn-sm my-2'
          document.getElementById(`${id}-form`).remove()
        }
      })
    })
  })
}

function createNewListItem (id, index, name, question) {
  const newListItem = document.createElement('LI')
  newListItem.id = id
  newListItem.innerHTML = templates.listitem(id, name, index, question)
  return newListItem
}

function createNewArchiveListItem (id, index, name, question, answer, helper) {
  const newArchiveListItem = document.createElement('LI')
  newArchiveListItem.id = id
  newArchiveListItem.innerHTML = templates.archiveitem(id, index, name, question)
  return newArchiveListItem
}

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

function markAsResolved (id, resolutionMessage, helper) {
  database.ref('requests/' + id).update({
    resolved: true
  }).then(function () {
    database.ref('requests/' + id).once('value', function (snapshot) {
      let name = snapshot.val().name
      let question = snapshot.val().question
      database.ref('archive/' + id).set({
        'name': name,
        'question': question,
        'resolution': resolutionMessage,
        'helper': helper,
        'id': id
      })
    })
  }).catch(function (err) {
    console.error(err)
  })
}

function displayArchivedQuestions () {
  // let message = {}
  database.ref('archive/').on('value', function (snapshot) {
    let result = snapshot.val()
    const messageIds = Object.keys(result)

    const archive = document.getElementById('archive')
    archive.innerHTML = ''
    messageIds.sort(function (a, b) {
      return a < b
    })
    messageIds.forEach((id, index) => {
      const item = result[id]
      let messageText = item.resolution
      let helper = item.helper

      archive.appendChild(createNewArchiveListItem(id, index + 1, item.name, item.question))
      const detailsButton = document.getElementById(`${id}-details`)
      detailsButton.addEventListener('click', e => {
        if (detailsButton.textContent === 'Details') {
          detailsButton.textContent = 'Collapse'
          const detailsDiv = document.createElement('DIV')
          detailsDiv.id = `${id}-detail-div`
          detailsDiv.className = 'form-group d-flex row my-2'
          detailsDiv.innerHTML = `
            <div class="col-md-1"></div>
            <div class="col-md-9">
              <p class="element answer text-secondary">${messageText}</p>
            </div>
            <div class="col-md-2">
              <p class="element helper text-center text-secondary">${helper}</p>
            </div>
          `
          const li = e.target.closest('LI')
          li.appendChild(detailsDiv)
          // console.log('button clicked')
        } else {
          detailsButton.textContent = 'Details'
          document.getElementById(`${id}-detail-div`).remove()
        }
      })
    })
  })
}

if (window.route === 'index') {
  // do login page stuff

} else if (window.route === 'askify') {
  let userInfo = JSON.parse(window.localStorage.getItem('user'))
  username = userInfo.fname
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
} else if (window.route === 'archive') {
  let userInfo = JSON.parse(window.localStorage.getItem('user'))
  const greetingDiv = document.getElementById('greeting')
  const queueNum = document.getElementById('queueSpot')
  queueNum.textContent = window.localStorage.getItem('place')
  greetingDiv.textContent = `Hello, ${userInfo.fname}!`
  displayArchivedQuestions()
}
