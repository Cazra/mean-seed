'use strict';

let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let _ = require('underscore');

let _model;
function initModel() {
  let Schema = mongoose.Schema;
  let heroSchema = Schema({
    name: {
      type: String,
      index: true,
      required: true
    }
  });
  heroSchema.plugin(autoIncrement.plugin, 'Hero');
  return _model = mongoose.model('Hero', heroSchema);
}

module.exports = function() {
  return _model || initModel();
}
