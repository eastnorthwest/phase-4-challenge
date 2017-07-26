const database = require('../config/database')

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      if (result.length) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
      if (result && result.length) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const getUserBySession = (session) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM users WHERE session = $1', [session], (error, result) => {
      if (result && result.length) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const addUser = (params, hash) => {
  return new Promise((resolve, reject) => {
    database.query('INSERT INTO users (name, email, password, datetime) VALUES ($1, $2, $3, NOW()) RETURNING id', [params.name, params.email, hash], (error, result) => {
      console.log('AddUser', error, result)
      if (result) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const updateUserSession = (user, session) => {
  return new Promise((resolve, reject) => {
    console.log("updateUserSession", user, session)
    database.query('UPDATE users SET session = $1 WHERE id = $2 RETURNING id', [session, user.id], (error, result) => {
      console.log('UpdateUserSession', error, result)
      if (result) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const deleteSession = (session) => {
  return new Promise((resolve, reject) => {
    database.query('UPDATE users SET session = \'\' WHERE session = $1', [session], (error, result) => {
      if (error) {
        reject(error)
        return;
      }
      resolve(result)
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

module.exports = {updateUserSession, deleteSession, getUserById, getUserByEmail, getUserBySession, addUser}