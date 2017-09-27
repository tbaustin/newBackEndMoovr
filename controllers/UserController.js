var Promise = require('bluebird');
var bcrypt = require('bcryptjs');

var Profile = require('../models/Profile');

module.exports = {
  get: (params, isRaw) => {
    return new Promise((resolve, reject) => {
      Profile.find(params, (err, profiles) => {
        if (err) {
          reject(err);
          return;
        }
        if (isRaw) {
          resolve(profiles);
        } else {
          const list = [];
          profiles.forEach(profile => {
            list.push(profile.summary());
          });

          resolve(list);
        }
      });
    });
  },

  getById: (id, isRaw) => {
    return new Promise((resolve, reject) => {
      Profile.findById(id, (err, profile) => {
        if (err) {
          reject(err);
          return;
        }

        if (profile == null) {
          reject(err);
        }

        if (isRaw) {
          resolve(profile);
        } else {
          resolve(profile.summary());
        }
      });
    });
  },

  post: (params, isRaw) => {
    return new Promise((resolve, reject) => {
      //hash password
      if (params['password']) {
        params['password'] = bcrypt.hashSync(params.password, 10);
      }

      Profile.create(params, (err, profile) => {
        if (err) {
          if (err.toJSON().code === 11000) {
            reject(
              `${err.toJSON().op.username ||
                err.toJSON().op.email} has already been taken`
            );
            return;
          }
          reject(err);
          return;
        }
        if (isRaw) {
          resolve(profile);
        } else {
          console.log(profile);
          resolve(profile.summary());
        }
      });
    });
  }
};
