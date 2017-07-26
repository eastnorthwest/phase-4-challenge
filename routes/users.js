const moment = require('moment')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

const users = require('../models/users')
const albums = require('../models/albums')
const auth = require('../auth/auth')

router.use(bodyParser.urlencoded({ extended: false }))

router.use((request, response, next) => {
  -- protect this path
  console.log('auth', request.sessionID)
  auth.checkUserSession(request.sessionID).next(() => {
    next()
  }).catch(() => {
    response.redirect('/auth/logout');
  })
})

router.get('/newreview/:albumID', (request, response) => {
    const albumID = request.params.albumID
    albums.getAlbumByID(albumID).then((album) => {
      response.render('users/newreview', { album: album })
    }).catch((error) => {
      response.status(500).render('error', { error: error })
    })
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