
const express = require('express')
const router = express.Router();

const albums = require('../models/albums')
const users = require('../models/users')

const auth = require('../auth/auth')

router.use((request, response, next) => {
  if (!request.session || !request.sessionID) {
    next();
    return;
  }
  auth.checkUserSession(request.sessionID).then((user) => {
    response.locals.user = user;
    next();
  }).catch(() => {
    response.locals.user = {};
    next();
  })
})

router.get('/', (request, response) => {
    albums.getAlbums((error, albums) => {
        if (error) {
            response.status(500).render('error', { error: error })
        } else {
            response.render('albums/index', { albums: albums })
        }
    })
})

router.get('/:albumID', (request, response) => {
    const albumID = request.params.albumID
    albums.getAlbumsByID(albumID, (error, albums) => {
        if (error) {
            response.status(500).render('error', { error: error })
        } else {
            const album = albums[0]
            response.render('albums/album', { album: album })
        }
    })
})

router.use((request, response) => {
    response.status(404).render('not_found')
})

module.exports = router;