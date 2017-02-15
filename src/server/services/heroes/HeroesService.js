'use strict';

let _ = require('underscore');

let Hero = require('../../models/Hero');

_.extend(module.exports, {

  /**
   * Creates a new Hero.
   * {Express.Request} req
   * {Express.Response} res
   */
  createHero: (req, res) => {
    console.log('Creating Hero: ' + req.body);

    Hero().create(req.body)
    .then(hero => {
      res.json({ data: hero });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  },

  /**
   * Gets a Hero by its ID.
   * {Express.Request} req
   * {Express.Response} res
   */
  getHeroById: (req, res) => {
    let id = req.params.heroId;
    console.log('Getting Hero: ' + id);

    Hero().findById(id)
    .then(hero => {
      res.json({ data: hero });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  },

  /**
   * Queries for a list of Heroes.
   * {Express.Request} req
   * {Express.Response} res
   */
  getHeroes: (req, res) => {
    console.log('Getting heroes: ' + req.body);

    Hero().find(req.body)
    .then(heroes => {
      res.json({ data: heroes });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  },

  /**
   * Removes an existing Hero.
   * {Express.Request} req
   * {Express.Response} res
   */
  removeHero: (req, res) => {
    let id = req.params.heroId;
    console.log('Removing hero: ' + id + ' ' + req.body);

    Hero().findByIdAndRemove(id)
    .then(result => {
      res.json({ data: result });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  },

  /**
   * Updates an existing Hero.
   * {Express.Request} req
   * {Express.Response} res
   */
  updateHero: (req, res) => {
    let id = req.params.heroId;
    console.log('Updating hero: ' + id + ' ' + req.body);

    Hero().findByIdAndUpdate(id, req.body)
    .then(hero => {
      res.json({ data: hero });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  }
});
