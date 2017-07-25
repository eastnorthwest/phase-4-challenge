const bcrypt = require('bcrypt-nodejs')
const users = require('../models/users')

const checkParams = (params) => {
  // add messages later
  result = true;
  if (!params.name || !params.email || !params.password) {
    result = false;
  }
  if (!checkEmail(params.email)) {
    result = false;
  }
  return result;
}

const checkEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const checkIfExists = (email) => {
  return new Promise((resolve, reject) => {
    users.getUserByEmail(email).then((result) => {
      console.log('getUserByEmail - resolved', result)
      resolve(result)
    }).catch(() => {
      console.log('getUserByEmail - catch')
      reject(false)
    })
  })
}

const createHashFromPassword = (password) => {
  return new Promise((resolve, reject) => {
    var salt = process.env.BCRYPT_SALT || 'vinyl';
    bcrypt.genSalt(10, function(error, salt) {
      bcrypt.hash(password, salt, null, function(error2, hash2) {
          console.log('createHashFromPassword', password, hash2, error2)
          if (hash2) {
            resolve(hash2)
            return;
          }
          reject(error2)
        });
    });
  })
}

module.exports = {checkParams, checkIfExists, createHashFromPassword}