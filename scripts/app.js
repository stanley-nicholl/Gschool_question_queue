const css = require('../styles/app.scss') // eslint-disable-line
let username

const {
  submitMessage,
  getAllRequests
} = require('./askify')

const {
  displayArchivedQuestions
} = require('./archive')

const {
  detect,
  handleSubmitButtonClick
} = require('./index')

if (window.location.href.includes('askify.html')) {
  let repeatUser = window.localStorage.getItem('repeatUser')

  if (!repeatUser) {
    window.location.href = '../index.html'
  }

  let userInfo = JSON.parse(window.localStorage.getItem('user'))
  username = userInfo.fname
  const submitButton = document.getElementById('add-request')
  const messageTextField = document.getElementById('message-text')
  const greetingDiv = document.getElementById('greeting')
  greetingDiv.textContent = `Hello, ${username}!`

  submitButton.addEventListener('click', e => {
    let messageText = messageTextField.value
    if (messageText !== '') {
      submitMessage(messageText, userInfo.fname)
      messageTextField.value = ''
    }
  })
  getAllRequests()
} else if (window.location.href.includes('archive.html')) {
  let repeatUser = window.localStorage.getItem('repeatUser')
  if (!repeatUser) {
    window.location.href = '../index.html'
  }

  let userInfo = JSON.parse(window.localStorage.getItem('user'))
  const greetingDiv = document.getElementById('greeting')
  const queueNum = document.getElementById('queueSpot')
  queueNum.textContent = window.localStorage.getItem('place')
  greetingDiv.textContent = `Hello, ${userInfo.fname}!`
  displayArchivedQuestions()
} else { // default route
  window.route = '/index.html'
  let userInfo = {}
  let submit = document.getElementById('submit')
  let repeatUser = window.localStorage.getItem('repeatUser')
  console.log('login?')
  detect(repeatUser)

  submit.addEventListener('click', function (e) {
    const success = handleSubmitButtonClick(userInfo)
    if (success) {
      window.location.href = '/pages/askify.html'
    }
  })
}
