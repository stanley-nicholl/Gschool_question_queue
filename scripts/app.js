// const css = require('../styles/app.scss') // eslint-disable-line
const database = require('../db')
let username

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
      displayQuestion(result, id, index, queueNum)
    })
  })
}

function displayQuestion(result, id, index, queueNum) {
  const item = result[id]
  if ((item.name === username) && (queueNum === 0)) {
    queueNum = index + 1
    queueSpot.textContent = queueNum
    window.localStorage.setItem('place', queueNum)
  }
  queue.appendChild(createNewListItem(id, index + 1, item.name, item.question))
  const answeredButton = document.getElementById(`${id}-answered`)
  const editButton = document.getElementById(`${id}-edit`)
  
  editButton.addEventListener('click', e => {
    handleEditButtonClick(editButton, item, id)
  })

  answeredButton.addEventListener('click', e => {
    handleAnswerButtonClick(answeredButton, id) 
  })
}


function handleEditButtonClick(editButton, item, id) {
  const questionText = document.getElementById(`${id}-question`)
  if (editButton.textContent === 'Edit') {
    editButton.textContent = 'Save'
    const input = document.createElement('INPUT')
    input.style.width = '100%'
    input.id = `${id}-edit-input`

    input.value = item.question
    questionText.textContent = ''
    questionText.appendChild(input)

  } else {
    editButton.textContent = 'Edit'
    const input = document.getElementById(`${id}-edit-input`)

    database.ref('requests/' + id).update({
      question: input.value
    })
    questionText.textContent = input.value
  }
}

function handleAnswerButtonClick(answeredButton, id) {
  if (answeredButton.textContent === 'Answered') {
    answeredButton.textContent = 'Cancel'
    answeredButton.className = 'btn item-button btn-warning btn-sm my-2'

    const li = answeredButton.closest('LI')
    const form = document.createElement('FORM')
    form.id = `${id}-form`
    form.className = 'form-group d-flex row my-2'
    form.innerHTML = templates.form(id)
    li.appendChild(form)
    document.getElementById(`archive-${id}`).addEventListener('click', e => {
      handleArchiveButtonClick(id)
    })
  } else {
    answeredButton.textContent = 'Answered'
    answeredButton.className = 'btn item-button btn-success btn-sm my-2'
    document.getElementById(`${id}-form`).remove()
  }
}

function handleArchiveButtonClick(id) {
  const helperForm = document.getElementById(`helper-${id}`)
  const solutionForm = document.getElementById(`answer-${id}`)
  if ((solutionForm.value !== '') && (helperForm.value !== '')) {
    markAsResolved(id, solutionForm.value, helperForm.value)
  } else if (solutionForm.value === '') {
    window.alert('Please let us know what the solution was.')
  } else if (helperForm.value === '') {
    window.alert('Please let us know who helped you.')
  }
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
  database.ref('archive/').on('value', function (snapshot) {
    let result = snapshot.val()
    const messageIds = Object.keys(result)

    const archive = document.getElementById('archive')
    archive.innerHTML = ''
    messageIds.sort(function (a, b) {
      return a < b
    })
    messageIds.forEach((id, index) => {
      displayMessage(result, id, index)
    })
  })
}

function displayMessage(result, id, index) {
  const item = result[id]
  let messageText = item.resolution
  let helper = item.helper

  archive.appendChild(createNewArchiveListItem(id, index + 1, item.name, item.question))
  const detailsButton = document.getElementById(`${id}-details`)
  detailsButton.addEventListener('click', e => {
    handleDetailsButtonClick(detailsButton, id, messageText, helper)
  })
}

function handleDetailsButtonClick(detailsButton ,id, messageText, helper) { 
  if (detailsButton.textContent === 'Details') {
    detailsButton.textContent = 'Collapse'
    const detailsDiv = document.createElement('DIV')
    detailsDiv.id = `${id}-detail-div`
    detailsDiv.className = 'form-group d-flex row my-2'
    detailsDiv.innerHTML = templates.detail(messageText, helper)
    const li = detailsButton.closest('LI')
    li.appendChild(detailsDiv)
  } else {
    detailsButton.textContent = 'Details'
    document.getElementById(`${id}-detail-div`).remove()
  }
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
