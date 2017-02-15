'use strict';

let _ = require('underscore');

let helloRoute = require('./hello');
let apiRouter = require('./api/ApiRouter');

_.extend(module.exports, {
  initRoutes: (app) => {
    helloRoute.init(app);
    apiRouter.init(app);
  }
});
