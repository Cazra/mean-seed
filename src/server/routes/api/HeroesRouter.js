'use strict';

const express = require('express');

const HeroesService = require('../../services/heroes/HeroesService');

/**
 * Router for Heroes services.
 */
class HeroesRouter {

  /**
   * Creates the Router.
   * @return {Express.Router}
   */
  static create() {
    let router = express.Router();

    router.route('/:heroId')
    .get(HeroesService.getHeroById)
    .put(HeroesService.updateHero)
    .delete(HeroesService.removeHero);

    router.route('/')
    .get(HeroesService.getHeroes)
    .post(HeroesService.createHero);

    return router;
  }
}
module.exports = HeroesRouter;
