const moment = require('moment')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

const users = require('../models/users')
const auth = require('../auth/auth')

router.use(bodyParser.urlencoded({ extended: false }))

router.use((request, response, next) => {
  if (!request.session || !request.sessionID) {
    response.redirect('/auth/logout');
    return;
  }
  next()
})

router.get('/:id', (request, response) => {
  if (!request.params.id) {
      return response.redirect('/auth/logout');
  }
  auth.checkSession(request.params.id, request.sessionID).then((user) => {
    delete(user.password)
    response.locals.user = user
    response.locals.user.joined = (moment(response.locals.user.datetime).isValid()) ? moment(response.locals.user.datetime).format("MMMM Do YYYY, h:mm a") : moment().format("MMMM Do YYYY, h:mm a'");
    response.render('users/profile')
  }).catch(() => {
    response.redirect('/auth/logout');
  })
})

router.use((request, response) => {
    response.status(404).render('not_found')
})

module.exports = router;