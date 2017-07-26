const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const users = require('../models/users')
const auth = require('../auth/auth')

router.use(bodyParser.urlencoded({ extended: false }))

router.get('/signup', (request, response) => {
  response.render('auth/signup')
})

router.get('/signin', (request, response) => {
  response.render('auth/signin')
})

router.get('/logout', (request, response) => {
  auth.doLogout(request).then(() => {
    response.redirect('/auth/signin?ok')
  }).catch((error) => {
    response.status(500).render('error', { error: error })
  })
})

router.post('/signin', (request, response) => {
  if (!auth.checkSigninParams(request.body)) {
    return response.redirect('/auth/signin?error')
  }
  auth.checkLogin(request).then((user) => {
    response.redirect('/users/' + user.id)
  }).catch(() => {
    response.redirect('/auth/signin?loginerror')
  })
})

router.post('/signup', (request, response) => {
  if (!auth.checkSignupParams(request.body)) {
    response.redirect('/auth/signup?error')
    return;
  }
  auth.checkExistsByEmail(request.body.email).then((result) => {
        response.redirect('/auth/signup?dupuser')
  }).catch(() => {
    auth.createHashFromPassword(request.body.password).then((hash) => {
      users.addUser(request.body, hash).then((result) => {
        response.redirect('/users/' + result.id)
      }).catch((error) => {
        response.status(500).render('error', { error: error })
      })
    }).catch((error) => {
      response.status(500).render('error', { error: error })
    })
  })
})

router.use((request, response) => {
    response.status(404).render('not_found')
})

module.exports = router;