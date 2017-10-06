function detect () {
  let repeatUser = window.localStorage.getItem('repeatUser')
  if (repeatUser) {
    window.location.pathname = '/pages/askify.html'
  }
}

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
