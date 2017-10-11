<<<<<<< HEAD
function detect (repeatUser) {
=======
function detect () {
  let repeatUser = window.localStorage.getItem('repeatUser')
>>>>>>> 1889062ab76661134df208daa6461d2487d08e33
  if (repeatUser) {
    window.location.pathname = '/pages/askify.html'
  }
}

<<<<<<< HEAD
function handleSubmitButtonClick(userInfo) {
  const fname = document.getElementById('fname').value
  const lname = document.getElementById('lname').value
  const email = document.getElementById('email').value
  userInfo['fname'] = fname
  userInfo['lname'] = lname
  userInfo['email'] = email

  if((fname !== '') && ((lname !== '') && (email !== ''))) {
    window.localStorage.setItem('repeatUser', 'yes')
    window.localStorage.setItem('userFName', document.getElementById('fname').value)
    window.localStorage.setItem('user', JSON.stringify(userInfo))  
    return true
  } else {
    return false
  }
}

module.exports = {
  detect,
  handleSubmitButtonClick
}
=======
if (window.location.pathname === '/') {
  let userInfo = {}
  let submit = document.getElementById('submit')

  detect()

  submit.addEventListener('click', function (e) {
    e.preventDefault()
    userInfo['fname'] = document.getElementById('fname').value
    userInfo['lname'] = document.getElementById('lname').value
    userInfo['email'] = document.getElementById('email').value
    window.localStorage.setItem('repeatUser', 'yes')
    window.localStorage.setItem('userFName', document.getElementById('fname').value)
    window.location.pathname = '/pages/askify.html'
    window.localStorage.setItem('repeatUser', 'yes')
    window.localStorage.setItem('user', JSON.stringify(userInfo))
    window.location.pathname = '/pages/askify.html'
  })
}
>>>>>>> 1889062ab76661134df208daa6461d2487d08e33
