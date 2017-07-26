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

router.get('/delete/:id', (request, response) => {
    reviews.deleteReviewById(request.params.id).then(() => {
      return response.redirect('/users/' + response.locals.user.id);
    }).catch((error) => {
      response.status(500).render('error', { error: error })
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

router.post('/newreview', (request, response) => {
    reviews.checkNewReview(request.body).then((album) => {
      reviews.addReview(request.body, response.locals.user).then(() => {
        response.redirect('/albums/' + request.body.albumId)
      }).catch(() => {
        response.redirect('/albums/' + request.body.albumId)
      })
    }).catch((error) => {
      response.redirect('/albums/' + request.body.albumId)
    })
})

router.use((request, response) => {
    response.status(404).render('not_found')
})

module.exports = router;