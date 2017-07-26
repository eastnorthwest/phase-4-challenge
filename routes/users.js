const moment = require('moment')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

const users = require('../models/users')
const albums = require('../models/albums')
const reviews = require('../models/reviews')
const auth = require('../auth/auth')

router.use(bodyParser.urlencoded({ extended: false }))

router.use((request, response, next) => {
  auth.getUserBySession(request.sessionID).then((user) => {
    response.locals.user = user
    next()
  }).catch(() => {
    return response.redirect('/auth/logout');
  })
})

router.get('/:id', (request, response) => {
  if (!request.params.id) {
      return response.redirect('/auth/logout');
  }
  auth.checkSession(request.params.id, request.sessionID).then((user) => {
    delete(user.password)
    response.locals.user = user
    response.locals.user.joined = (moment(response.locals.user.datetime).isValid()) ? moment(response.locals.user.datetime).format("MMMM Do YYYY, h:mm a") : moment().format("MMMM Do YYYY, h:mm a'")
    reviews.getReviews("userId", user.id).then((reviews) => {
        response.render('users/profile', { reviews: reviews })
      }).catch(() => {
        response.status(500).render('error', { error: error })
      })
  }).catch((error) => {
    response.status(500).render('error', { error: error })
  })
})

router.use((request, response) => {
    response.status(404).render('not_found')
})

module.exports = router;