'use strict';

const autoIncrement = require('mongoose-auto-increment');
const compression = require('compression');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const Spinner = require('cli-spinner').Spinner;
const stoppable = require('stoppable');
const _ = require('underscore');

const Databases = require('./db/Databases');
const JsonParser = require('./middleware/JsonParser');
const RestLogger = require('./middleware/RestLogger');
const routes = require('./routes');
const SystemService = require('./services/SystemService');

/**
 * The 'main' program for the MEAN stack app's web server.
 */
class MeanServer {
  /**
   * The MongoDB connection.
   */
  get db() {
    return this._db;
  }

  constructor() {
    this._boundSigintHandler = this._sigintHandler.bind(this);
    this._spinner = new Spinner('');
  }

  /**
   * Gracefully exits the server.
   */
  shutdown() {
    console.info('Closing the web server...');

    // Unsubscribe the SIGINT handler.
    process.removeListener('SIGINT', this._boundSigintHandler);

    // Clean-up the server.
    return Promise.all([
      this._stopServer(),
      this._stopDB()
    ])
    .then(() => {
      console.info('Web server shutdown complete.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Shutdown error:', err);
      throw err;
    });
  }

  _sigintHandler() {
    this._spinner.stop(true);
    this.shutdown();
  }

  /**
   * Starts the server.
   */
  start() {
    // Shutdown when we get a SIGINT (ctrl c).
    process.on('SIGINT', this._boundSigintHandler);

    this._spinner.setSpinnerTitle('Initializing server...');
    this._spinner.setSpinnerString(18);
    this._spinner.start();

    return Databases.connect('mongodb://localhost/tour-of-heroes', {
      useMongoClient: true
    })
    .then(db => {
      this._db = db;

      // Set up some event listeners for the DB.
      this._dbListenerDisconnected = () => {
        console.warn('Database disconnected.');
      };
      this._dbListenerError = err => {
        console.error(err);
      };
      this._dbListenerReconnected = () => {
        console.info('Database reconnected.');
      };
      db.on('disconnected', this._dbListenerDisconnected);
      db.on('error', this._dbListenerError);
      db.on('reconnected', this._dbListenerReconnected);

      autoIncrement.initialize(db);

      console.info('DB connection successful!');
    })
    .then(() => {
      return this._startExpress();
    })
    .then(() => {
      this._spinner.stop(true);
    })
    .catch(err => {
      console.error(err);
    });
  }

  /**
   * Starts the Express server for the MEAN stack app.
   */
  _startExpress() {
    let app = express();

    // Install the middlewares.
    mongoose.Promise = Promise;
    // app.use(favicon('www/images/favicon.ico'));
    _.noop(favicon);
    app.use(JsonParser.middleware());
    app.use(compression());
    app.use(RestLogger.middleware());

    // Start listening and set up the Express server routes.
    return SystemService.systemInfo
    .then(info => {
      let version = info.version;
      let serverOpts = info.api;

      return new Promise(resolve => {
        this._server = app.listen(serverOpts.port, () => {
          routes.initRoutes(app);

          console.info(`Application server v${version} started. ` +
            `Listening for requests on port ${serverOpts.port}.\n` +
            `Use ctrl-c to quit.`);
          resolve();
        });

        // Use stoppable to allow the server to end all idle keep-alive
        // connections when it closes.
        stoppable(this._server);
      });
    });
  }

  /**
   * Closes the server's database connection.
   */
  _stopDB() {
    this._db.removeListener('disconnected', this._dbListenerDisconnected);
    this._db.removeListener('error', this._dbListenerError);
    this._db.removeListener('reconnected', this._dbListenerReconnected);

    return Promise.resolve()
    .then(() => {
      return this._db.close();
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
  }

  /**
   * Closes the server's port.
   * @return {Promise}
   */
  _stopServer() {
    return new Promise((resolve, reject) => {
      this._server.stop(err => {
        if(err)
          reject(err);
        else
          resolve();
      });
    });
  }
}
let singleton = new MeanServer();
module.exports = singleton;

if(require.main === module)
  singleton.start();
