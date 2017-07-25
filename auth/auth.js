const bcrypt = require('bcrypt')
const users = require('../models/users')

const checkSignupParams = (params) => {
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

const checkSigninParams = (params) => {
  // add messages later
  result = true;
  if (!params.email || !params.password) {
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

const checkExistsByEmail = (email) => {
  return new Promise((resolve, reject) => {
    users.getUserByEmail(email).then((user) => {
      console.log('getUserByEmail - resolved', user)
      resolve(result)
    }).catch(() => {
      console.log('getUserByEmail - failed')
      reject(false)
    })
  })
}

const createHashFromPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(error, hash) {
        console.log('createHashFromPassword', password, hash, error)
        if (hash) {
          return resolve(hash)
        }
        reject(error2)
      });
      });
}

const checkLogin = (request) => {
  return new Promise((resolve, reject) => {
    users.getUserByEmail(request.body.email).then((user) => {
      bcrypt.compare(request.body.password, user.password, (error, result) => {
        if (result) {
          console.log("Link session", request.sessionID)
          request.session.regenerate(() => {
            users.updateUserSession(user, request.sessionID).then((id) => {
              resolve(user)
            }).catch(() => {
              reject(false)
            })
          })
        } else {
          reject(false)
        }
      })
    }).catch(() => {
      console.log('doLogin - failed')
      reject(false)
    })
  })
}

const doLogout = (request) => {
  return new Promise((resolve, reject) => {
    users.deleteSession(request.sessionID).then(() => {
      request.session.destroy(() => {
        resolve();
      });
    })
  })
}

const checkSession = (userId, session) => {
  return new Promise((resolve, reject) => {
    users.getUserById(userId).then((user) => {
      if (user.session == session) {
        return resolve(user);
      }
      reject(false)
    }).catch(() => {
      reject(false)
    })
  })
}

module.exports = {doLogout, checkLogin, checkSigninParams, checkSignupParams, checkExistsByEmail, createHashFromPassword, }