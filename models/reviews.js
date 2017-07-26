const database = require('../config/database')

const albums = require('../models/albums')

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

const getReviews = (max) => {
  var maxResult = max || 10;
  return new Promise((resolve, reject) => {
    database.query('SELECT r.text, r.datetime, u.name, a.id as albumid, a.title \
                    FROM users_reviews ur JOIN reviews r ON ur.review_id = r.id \
                    JOIN users u ON ur.user_id = u.id JOIN albums a ON a.id = ur.album_id ORDER BY r.datetime DESC LIMIT $1', [maxResult], (error, result) => {
      if (result && result.length) {
        resolve(result)
        return;
      }
      reject(error)
    })
  })
}

const getReviewsByAlbumId = (albumId, max) => {
  var maxResult = max || 10;
  return new Promise((resolve, reject) => {
    database.query('SELECT r.text, r.datetime, u.name, a.id as albumid, a.title \
                    FROM users_reviews ur JOIN reviews r ON ur.review_id = r.id \
                    JOIN users u ON ur.user_id = u.id JOIN albums a ON a.id = ur.album_id WHERE a.id = $1 ORDER BY r.datetime DESC LIMIT $2', [albumId, maxResult], (error, result) => {
      if (result && result.length) {
        resolve(result)
        return;
      }
      reject(error)
    })
  })
}

const checkNewReview = (form) => {
  console.log('checkNewReview', form)
  return new Promise((resolve, reject) => {
    if (!form.review || !form.albumId) {
      reject(false)
    }
    albums.getAlbumByID(form.albumId).then((album) => {
      resolve(album)
    }).catch((error) => {
      reject(error)
    })
  })
}


const addReview = (form, user) => {
  console.log("addReview", form, user)
  return new Promise((resolve, reject) => {
    if (!form.review || !form.albumId || !user.id) {
      return reject(false)
    }
    var transaction = database.tx();
    transaction.on('error', (error) => {
      console.log("Error... ", error)
      transaction.rollback('start');
      return reject(error)
    })
    transaction.begin()
    transaction.savepoint('start');
    transaction.query('INSERT INTO reviews (text, datetime) VALUES ($1::text, NOW()) RETURNING id', [form.review])
    transaction.query('INSERT INTO users_reviews (user_id, album_id, review_id) VALUES ($1, $2, currval(\'reviews_id_seq\'))', [user.id, form.albumId])
    transaction.commit();
    resolve()
  })
}

module.exports = {getReviewsByAlbumId, getReviewByID, getReviews, checkNewReview, addReview}
