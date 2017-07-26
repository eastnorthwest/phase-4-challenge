const database = require('../config/database')

const getReviewByID = (id) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT * FROM reviews WHERE id = $1', [id], (error, result) => {
      if (result && result.length) {
        resolve(result[0])
        return;
      }
      reject(error)
    })
  })
}

const getReviewsByAlbumId = (albumId) => {
  return new Promise((resolve, reject) => {
    database.query('SELECT r.*, u.*, a.* FROM reviews r, users u, albums a JOIN users_reviews ur ON ur.review_id = r.id JOIN ur ON ur.album_id =  a.id JOIN ur ON ur.user_id = u.id WHERE a.id = $1', [albumId], (error, result) => {
      if (result && result.length) {
        resolve(result)
        return;
      }
      reject(error)
    })
  })
}

const checkNewReview = (form) => {
  return new Promise((resolve, reject) => {
    if (!form.review || !form.albumId) {
      reject(false)
    }
    getAlbumByID(form.albumId).then((album) => {
      resolve(album)
    }).catch((error) => {
      reject(error)
    })
  })
}


const addReview = (form, user) => {
  return new Promise((resolve, reject) => {
    if (!form.review || !form.albumId || !user.id) {
      reject(false)
    }
    var transaction = database.tx();
    transaction.on('error', (error) => {
      transaction.rollback('start');
      reject(error)
    })
    transaction.begin()
    transaction.savepoint('start');
    transaction.query('INSERT INTO reviews (text, datetime) VALUES ($1, NOW()) RETURNING id', [form.review])
    transaction.query('INSERT INTO users_reviews (user_id, album_id, review_id) VALUES ($1, $2, $3)', [user.id, form.albumId, id])
    transaction.commit();
    transaction.release('start');
    getReviewByID(id).then((review) => {
      resolve(review)
    }).catch((error) => {
      reject(error)
    })
  })
}

module.exports = {getReviewsByAlbumId, getReviewByID, checkNewReview, addReview}
