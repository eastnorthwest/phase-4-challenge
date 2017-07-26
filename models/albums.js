const database = require('../config/database')

const getAlbumByID = (id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM albums WHERE id = $1', [id], (error, result) => {
      if (result && result.length) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const getAlbums = () => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM albums', [], (error, result) => {
      if (result && result.length) {
        resolve(result)
        return;
      }
      reject(error)
    })
  })
}

module.exports = {getAlbums, getAlbumByID}
