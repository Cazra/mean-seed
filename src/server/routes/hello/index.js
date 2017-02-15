'use strict';

let _ = require('underscore');

let HelloService = require('../../services/hello/HelloService');

_.extend(module.exports, {
  init: (app) => {
    app.get('/hello', HelloService.hello);
  }
});
