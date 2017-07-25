const database = require('../config/database')

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT id FROM users WHERE email = $1', [email], (error, result) => {
      if (result) {
        resolve(result)
      }
      reject(error)
    })
  })
}

const addUser = (params, hash) => {
  return new Promise((resolve, reject) => {
    database.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', [params.name, params.email, params.password], (error, result) => {
      console.log('AdduSer', error, result)
      if (result) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}
/*
app.get('/', (request, response) => {
    database.getAlbums((error, albums) => {
        if (error) {
            response.status(500).render('error', { error: error })
        } else {
            response.render('index', { albums: albums })
        }
    })
})

app.get('/albums/:albumID', (request, response) => {
    const albumID = request.params.albumID

    database.getAlbumsByID(albumID, (error, albums) => {
        if (error) {
            response.status(500).render('error', { error: error })
        } else {
            const album = albums[0]
            response.render('albums/album', { album: album })
        }
    })
})
*/

module.exports = {getUserByEmail, addUser}