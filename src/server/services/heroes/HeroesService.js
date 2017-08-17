'use strict';

const Models = require('../../db/Models');
const Hero = require('../../models/Hero');

/**
 * Service concerning persisted Hero records.
 */
class HeroesService {

  /**
   * Creates a new Hero.
   * {Express.Request} req
   * {Express.Response} res
   */
  static createHero(req, res) {
    console.log('Creating Hero: ' + req.body);

    Models.create(Hero.model(), req.body)
    .then(hero => {
      res.json({ data: hero });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }

  /**
   * Gets a Hero by its ID.
   * {Express.Request} req
   * {Express.Response} res
   */
  static getHeroById(req, res) {
    let id = req.params.heroId;
    console.log('Getting Hero: ' + id);

    Hero.model().findById(id)
    .then(hero => {
      res.json({ data: hero });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }

  /**
   * Queries for a list of Heroes.
   * {Express.Request} req
   * {Express.Response} res
   */
  static getHeroes(req, res) {
    console.log('Getting heroes: ' + req.body);

    Hero.model().find(req.body)
    .then(heroes => {
      res.json({ data: heroes });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }

  /**
   * Removes an existing Hero.
   * {Express.Request} req
   * {Express.Response} res
   */
  static removeHero(req, res) {
    let id = req.params.heroId;
    console.log('Removing hero: ' + id + ' ' + req.body);

    Hero.model().findByIdAndRemove(id)
    .then(result => {
      res.json({ data: result });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }

  /**
   * Updates an existing Hero.
   * {Express.Request} req
   * {Express.Response} res
   */
  static updateHero(req, res) {
    let id = req.params.heroId;
    console.log('Updating hero: ' + id + ' ' + req.body);

    Hero.model().findByIdAndUpdate(id, req.body)
    .then(hero => {
      res.json({ data: hero });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }
}
module.exports = HeroesService;
