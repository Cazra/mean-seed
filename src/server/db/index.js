'use strict';

let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let _ = require('underscore');

_.extend(module.exports, {

  /**
   * Connects to and initializes the database for the application.
   * A Promise is returned containing the database connection if it is
   * successful.
   * @param {string} uri
   * @param {object} options
   *        An options object compatible with mongoose.connect().
   * @return {Promise<mongoose.Connection>}
   */
  connect: (uri, options) => {
    return mongoose.connect(uri, options)
    .then(() => {
      console.log('Connected to ' + uri + '!');

      var db = mongoose.connection;
      // TODO: Set DB to use and Intialize collections for demo.

      autoIncrement.initialize(db);
      return db;
    })
    .catch(err => {
      console.error(err);
    });
  }
});
