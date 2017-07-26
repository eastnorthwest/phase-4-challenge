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
      resolve(result)
    }).catch(() => {
      reject(false)
    })
  })
}

const createHashFromPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(error, hash) {
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
          request.session.regenerate(() => {
              delete(user.password)
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
    if (!request || !request.sessionID) {
      resolve();
      return;
    }
    users.deleteSession(request.sessionID).then((result) => {
      request.session.destroy(() => {
        resolve();
      });
    }).catch(() => {
      request.session.destroy(() => {
        resolve();
      });
    });
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

const checkUserSession = (session) => {
  return new Promise((resolve, reject) => {
    if (!session) {
      return reject(false)
    }
    users.getUserBySession(session).then((user) => {
      if (user && user.id) {
        delete(user.password)
        return resolve(user)
      }
      reject(false);
    }).catch(() => {
      reject(false)
    })
  })
}

module.exports = {checkSignupParams, checkSigninParams, checkExistsByEmail, createHashFromPassword, checkLogin, doLogout, checkSession, checkUserSession}