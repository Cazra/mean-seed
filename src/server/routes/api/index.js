'use strict';

const express = require('express');

const HeroesRouter = require('./HeroesRouter');

/**
 * The Express router for API services.
 */
class ApiRouter {

  /**
   * Creates the router.
   * @return {Express.Router}
   */
  static create() {
    let router = express.Router();
    router.use('/heroes', HeroesRouter.create());
    return router;
  }
}
module.exports = ApiRouter;
