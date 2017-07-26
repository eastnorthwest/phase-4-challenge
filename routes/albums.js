
const express = require('express')
const router = express.Router();

const albums = require('../models/albums')
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
      response.render('albums/index', { albums: albums })
    }).catch((error) => {
      response.status(500).render('error', { error: error })
    })
})

router.get('/:albumID', (request, response) => {
    const albumID = request.params.albumID
    albums.getAlbumByID(albumID).then((album) => {
      console.log("AlbumPage", album)
      response.render('albums/album', { album: album })
    }).catch((error) => {
      response.status(500).render('error', { error: error })
    })
})

router.use((request, response) => {
    response.status(404).render('not_found')
})

module.exports = router;