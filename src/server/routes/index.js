'use strict';

const express = require('express');

const HelloRouter = require('./hello');
const ApiRouter = require('./api');
const SystemService = require('../services/SystemService');

/**
 * Top-level definition for the application's Express routes.
 */
class Routes {

  /**
   * Initializes the application's routers and their routes.
   * @param {Express} app
   */
  static initRoutes(app) {
    app.use('/app', express.static('www/app'));
    app.use('/fonts', express.static('www/fonts'));
    app.use('/images', express.static('www/images'));
    app.use('/lib', express.static('www/lib'));
    app.use('/styles', express.static('www/styles'));
    app.use('/webworkers', express.static('www/webworkers'));

    app.use('/rest', ApiRouter.create());
    app.use('/hello', HelloRouter.create());

    app.get('/system-info', SystemService.getSystemInfo);
    app.get('/**', Routes._redirectAngular);
  }

  static _redirectAngular(req, res) {
    res.sendFile('index.html', { root: 'www' });
  }
}
module.exports = Routes;
