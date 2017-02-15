'use strict';

let express = require('express');
let _ = require('underscore');

let HeroesService = require('../../services/heroes/HeroesService');

_.extend(module.exports, {

  /**
   * Initializes the heroes services route.
   * @param {Express.Router} router
   */
  init: (router) => {
    let heroesRouter = express.Router();

    // Heroes by ID
    heroesRouter.route('/:heroId')
    .get(HeroesService.getHeroById)
    .put(HeroesService.updateHero)
    .delete(HeroesService.removeHero);

    // Heroes by query
    heroesRouter.route('/')
    .get(HeroesService.getHeroes)
    .post(HeroesService.createHero);

    router.use('/heroes', heroesRouter);
  }
});
