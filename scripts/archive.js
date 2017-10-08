const database = require('../db')
const templates = require('../templates')


function createNewArchiveListItem (id, index, name, question, answer, helper) {
  const newArchiveListItem = document.createElement('LI')
  newArchiveListItem.id = id
  newArchiveListItem.innerHTML = templates.archiveitem(id, index, name, question)
  return newArchiveListItem
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

module.exports = {
  createNewArchiveListItem,
  displayArchivedQuestions,
  displayMessage,
  handleDetailsButtonClick
}