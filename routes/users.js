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

router.get('/users/:id', (request, response) => {
  console.log('users profile', request.params)
  if (!request.params.id) {
      return response.redirect('/users/logout');
  }
  auth.checkSession(request.params.id, request.sessionID).then((user) => {
    response.render('users/profile', {'user': user})
  }).catch(() => {
    response.redirect('/users/logout');
  })
})

router.get('/logout', (request, response) => {
  auth.doLogout(request.sessionID).then(() => {
    response.redirect('/users/signin')
  })
})

router.post('/signin', (request, response) => {
  if (!auth.checkSigninParams(request.body)) {
    return response.redirect('/users/signin?error')
  }
  auth.checkLogin(request).then((result) => {
    response.redirect('/users/' + result.id)
  }).catch(() => {
    response.redirect('/users/signin?loginerror')
  })
})

router.post('/signup', (request, response) => {
  if (!auth.checkSignupParams(request.body)) {
    response.redirect('/users/signup?error')
    return;
  }
  auth.checkExistsByEmail(request.body.email).then((result) => {
        response.redirect('/users/signup?dupuser')
  }).catch(() => {
    auth.createHashFromPassword(request.body.password).then((hash) => {
      users.addUser(request.body, hash).then((result) => {
        response.redirect('/users/' + result.id)
      }).catch(() => {
        response.redirect('/users/signup?addusererror')
      })
    }).catch((err) => {
      response.redirect('/users/signup?createhasherror')
    })
  })
})

module.exports = router;