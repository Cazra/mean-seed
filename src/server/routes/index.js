'use strict';

const express = require('express');

const HelloRouter = require('./hello');
const ApiRouter = require('./api');
const SystemService = require('../services/SystemService');

/**
 * Top-level definition for the application's Express routes.
 */
module.exports = class Routes {

  /**
   * Initializes the application's routers and their routes.
   * @param {Express} app
   */
  static initRoutes(app) {
    app.use('/rest', ApiRouter.create());
    app.use('/hello', HelloRouter.create());

    app.get('/system-info', SystemService.getSystemInfo);

    app.use(express.static('www'));
  }
};
