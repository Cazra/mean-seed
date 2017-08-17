'use strict';

const mongoose = require('mongoose');
const _ = require('underscore');

/**
 * A lbrary for accessing Mongo databases.
 */
module.exports = class Databases {

  /**
   * Connects to a Mongo database.
   * @param {String} uri
   * @param {Mongoose.ConnectOptions} options
   * @return {Promise<monoose.Connection>}
   */
  static connect(uri, options) {
    _.extend(options, {
      useMongoClient: true
    });

    // Suffix the URI with the current node environment
    // e.g. 'development', 'testing', 'production'
    let env = process.env.NODE_ENV;
    if(env)
      uri += '-' + env;

    return mongoose.connect(uri, options)
    .then(() => {
      return mongoose.connection;
    });
  }

  /**
   * Disconnects from the Mongo databases.
   * @return {Promise}
   */
  static disconnect() {
    return mongoose.disconnect();
  }
};
