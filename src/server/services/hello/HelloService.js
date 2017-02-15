'use strict';

let _ = require('underscore');

_.extend(module.exports, {
  hello: (req, res) => {
    console.log('Hello World!');
    res.send('Hello World!');
  }
});
