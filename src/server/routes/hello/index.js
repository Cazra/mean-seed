'use strict';

const express = require('express');

const HelloService = require('../../services/hello/HelloService');

/**
 * Router for the Hello World service.
 */
module.exports = class HelloRouter {

  /**
   * Creates the router.
   * @return {Express.Router}
   */
  static create() {
    let router = express.Router();

    router.route('/')
    .get(HelloService.hello);

    return router;
  }
};
