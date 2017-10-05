let userInfo = {}
let submit = document.getElementById('submit')
let repeatUser = localStorage.getItem('repeatUser')


function detect() {
  if(repeatUser){
    window.location.href = "askify.html"
  }
}

detect()

submit.addEventListener('click', function(e){
  e.preventDefault()
  userInfo['fname'] = document.getElementById('fname').value
  userInfo['lname'] = document.getElementById('lname').value
  userInfo['email'] = document.getElementById('email').value
  localStorage.setItem('repeatUser', 'yes')
  localStorage.setItem('userFName', document.getElementById('fname').value)
  window.location.href = "askify.html"
})
