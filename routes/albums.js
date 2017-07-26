
const express = require('express')
const router = express.Router();

const albums = require('../models/albums')
const reviews = require('../models/reviews')
const users = require('../models/users')

const auth = require('../auth/auth')

router.use((request, response, next) => {
  if (!request.session || !request.sessionID) {
    next()
    return
  }
  auth.getUserBySession(request.sessionID).then((user) => {
    response.locals.user = user
    next()
  }).catch(() => {
    response.locals.user = {}
    next()
  })
})

router.get('/', (request, response) => {
    albums.getAlbums().then((albums) => {
      reviews.getReviews(null, null, 3).then((reviews) => {
        response.render('albums/index', { albums: albums, reviews: reviews })
      }).catch(() => {
        response.status(500).render('error', { error: error })
      })
    }).catch((error) => {
      response.status(500).render('error', { error: error })
    })
})

router.get('/:albumID', (request, response) => {
    const albumID = request.params.albumID
    albums.getAlbumByID(albumID).then((album) => {
      reviews.getReviews("albumId", albumID, 99).then((reviews) => {
        response.render('albums/album', { album: album, reviews: reviews })
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