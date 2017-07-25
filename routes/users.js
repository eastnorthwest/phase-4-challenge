const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const users = require('../models/users')
const auth = require('../auth/auth')

router.use(bodyParser.urlencoded({ extended: false }))

router.get('/signup', (request, response) => {
  response.render('users/signup');
})

router.get('/signin', (request, response) => {
  response.render('users/signin');
})

router.post('/signup', (request, response) => {
  if (!auth.checkParams(request.body)) {
    response.redirect('/users/signup?error')
    return;
  }
  console.log('Do Signup')
  auth.checkIfExists(request.body.email).then((result) => {
    if (result) {
      response.redirect('/users/signup?dupuseruerror')
    }
    console.log("Proceed to createHash")
    auth.createHashFromPassword(request.body.password).then((hash) => {
      users.addUser(request.body, hash).then((result) => {
        response.redirect('/users/' + result.id)
      }).catch(() => {
        response.redirect('/users/signup?addusererror')
      })
    }).catch((err) => {
      console.log("HashErr", err)
      response.redirect('/users/signup?createhasherror')
    })
  }).catch((error) => {
    console.log('checkIfExists Error', error)
    response.redirect('/users/signup?errordup')
  })
})

module.exports = router;