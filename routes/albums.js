
const express = require('express')
const router = express.Router();

const albumsModel = require('../models/albums')

router.get('/', (request, response) => {
    albumsModel.getAlbums((error, albums) => {
        if (error) {
            response.status(500).render('error', { error: error })
        } else {
            response.render('albums/index', { albums: albums })
        }
    })
})

router.get('/:albumID', (request, response) => {
    const albumID = request.params.albumID
    albumsModel.getAlbumsByID(albumID, (error, albums) => {
        if (error) {
            response.status(500).render('error', { error: error })
        } else {
            const album = albums[0]
            response.render('albums/album', { album: album })
        }
    })
})

module.exports = router;