'use strict';

let express = require('express');
let _ = require('underscore');

let HeroesRoute = require('./HeroesRoute');

_.extend(module.exports, {

  /**
   * Initializes the API router for the application.
   * @param {Express} app
   */
  init: (app) => {
    let apiRouter = express.Router();

    // Initialize the API's routers.
    HeroesRoute.init(apiRouter);

    app.use('/rest', apiRouter);
  }
});
