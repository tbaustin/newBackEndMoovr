const Promise = require('bluebird');
const Offer = require('../models/Offer');

module.exports = {
  find: (params, callback) => {
    Offer.find(params, (err, offers) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, offers);
    });
  },

  findById: (id, callback) => {
    Offer.findById(id, (err, offer) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, offer);
    });
  },

  findOne: (params, callback) => {
    Offer.findOne(params, (err, offer) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, offer);
    });
  },

  create(params, callback) {
    Offer.create(params, (err, offer) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, offer);
    });
  },

  update: (foundOne, params, callback) => {
    Offer.findOneAndUpdate(foundOne, params, { new: true }, (err, offer) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, offer);
    });
  },

  sort: (params, callback) => {
    Offer.find(params, (err, offers) => {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, offers);
    });
  }
};
