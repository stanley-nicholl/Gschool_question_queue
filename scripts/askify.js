const database = require('../db')
const templates = require('../templates')

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

function displayQueueNumber (queueSpotNumber) {
  const queueSpot = document.getElementById('queueSpot')
  if (queueSpotNumber) queueSpot.textContent = queueSpotNumber
}

function getAllRequests () {
  database.ref('requests/').on('value', snapshot => {
    let result = snapshot.val()

    const ids = Object.keys(result)
    const queue = document.getElementById('queue')
    const username = window.localStorage.getItem('userFName')
    let queueNum = 0
    queue.innerHTML = ''
    const openQuestions = ids.filter(id => !result[id].resolved)
    openQuestions.forEach((id, index) => {
      if ((queueNum === 0) && (result[id].name === username)) {
        queueNum = index + 1
      }
      displayQuestion(result, id, index)
    })
    displayQueueNumber(queueNum)
  })
}

function displayQuestion (result, id, index) {
  const item = result[id]
  const queue = document.getElementById('queue')
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

function handleEditButtonClick (editButton, item, id) {
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

function handleAnswerButtonClick (answeredButton, id) {
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

function handleArchiveButtonClick (id) {
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

module.exports = {
  submitMessage,
  getAllRequests
}
