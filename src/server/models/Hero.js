'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Models = require('../db/Models');

/**
 * Defines the Hero model.
 */
module.exports = Models.define('Hero', () => {
  const app = require('../app');
  autoIncrement.initialize(app.db);

  let schema = mongoose.Schema({
    // _id,
    name: {
      type: String,
      required: true
    },
    powers: {
      type: [String],
      default: () => {
        return [];
      }
    }
  });

  schema.index({ name: 1 }, { unique: true });
  schema.plugin(autoIncrement.plugin, 'Hero');
  return schema;
}, { persist: true });
