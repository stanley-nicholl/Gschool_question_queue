function detect (repeatUser) {
  if (repeatUser) {
    window.location.href = 'askify.html'
  }
}

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