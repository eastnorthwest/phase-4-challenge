const database = require('../config/database')

const getAlbums = function(callback) {
  database.query("SELECT * FROM albums", [], callback)
}

const getAlbumsByID = function(albumID, callback) {
  database.query("SELECT * FROM albums WHERE id = $1", [albumID], callback)
}

module.exports = {
  getAlbums,
  getAlbumsByID
}
