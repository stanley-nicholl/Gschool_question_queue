// const css = require('../styles/app.scss') // eslint-disable-line
let username

const {
  submitMessage,
  getAllRequests,
  displayQuestion,
  handleEditButtonClick,
  handleAnswerButtonClick,
  handleArchiveButtonClick,
  createNewListItem,
  markAsResolved
} = require('./askify')

const {
  createNewArchiveListItem,
  displayArchivedQuestions,
  displayMessage,
  handleDetailsButtonClick
} = require('./archive')

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
