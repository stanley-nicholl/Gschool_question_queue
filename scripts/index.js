let userInfo = {}
let submit = document.getElementById('submit')
let repeatUser = window.localStorage.getItem('repeatUser')

function detect () {
  if (repeatUser) {
    window.location.href = 'askify.html'
  }
}

detect()

submit.addEventListener('click', function (e) {
  e.preventDefault()
  userInfo['fname'] = document.getElementById('fname').value
  userInfo['lname'] = document.getElementById('lname').value
  userInfo['email'] = document.getElementById('email').value
  window.localStorage.setItem('repeatUser', 'yes')
  window.localStorage.setItem('userFName', document.getElementById('fname').value)
  window.location.href = 'askify.html'
  window.localStorage.setItem('repeatUser', 'yes')
  window.localStorage.setItem('user', JSON.stringify(userInfo))
  window.location.href = 'askify.html'
})
