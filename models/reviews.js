const moment = require('moment');

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

const getReviews = (mode, id, max) => {
  var filter = '', orderBy = ''
  var maxResult = max || 10
  console.log('getReviews', mode, id, maxResult)
  switch (mode) {
    case "albumId": 
      filter = 'WHERE a.id = $1'
      orderByLimit = 'ORDER BY r.datetime DESC LIMIT $2'
      params = [id, maxResult]
      break
    case "userId":
      filter = 'WHERE u.id = $1'
      orderByLimit = 'ORDER BY r.datetime DESC LIMIT $2'      
      params = [id, maxResult]
      break
    default:
      orderByLimit = 'ORDER BY r.datetime DESC LIMIT $1'
      params = [maxResult]
  }
  return new Promise((resolve, reject) => {
    database.query('SELECT r.text, r.datetime, u.name, a.id as albumid, a.title \
                    FROM users_reviews ur JOIN reviews r ON ur.review_id = r.id \
                    JOIN users u ON ur.user_id = u.id JOIN albums a ON a.id = ur.album_id ' + filter + ' ' + orderByLimit, params, (error, result) => {
      if (result) {
        var formattedResults = result.map((review, index) => {
          review.reviewDate = (moment(review.datetime).isValid()) ? moment(review.datetime).format("MMMM Do YYYY") : ""
          return review
        })
        resolve(formattedResults)
        return
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
      //transaction.rollback('start');
      return reject(error)
    })
    transaction.begin()
    transaction.savepoint('start');
    transaction.query('INSERT INTO reviews (text, datetime) VALUES ($1::text, NOW()) RETURNING id', [form.review])
    transaction.query('INSERT INTO users_reviews (user_id, album_id, review_id) VALUES ($1, $2, currval(\'reviews_id_seq\'))', [user.id, form.albumId])
    transaction.release('start')
    transaction.commit();
    resolve()
  })
}

module.exports = {getReviewByID, getReviews, checkNewReview, addReview}
