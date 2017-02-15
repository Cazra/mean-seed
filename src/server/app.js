'use strict';

let bodyParser = require('body-parser');
let express = require('express');
let _ = require('underscore');

let db = require('./db');
let routes = require('./routes');

_.extend(module.exports, {

  /**
   * Starts the Express server for our web app.
   * @param {int} port
   */
  startServer: (port) => {
    let app = express();

    app.use(bodyParser.json());

    routes.initRoutes(app);
    app.use(express.static('www'));

    app.listen(port, function() {
      console.log('Example app listening on port ' + port);

      db.connect('mongodb://app:4ypeTrain@localhost/tour-of-heroes')
      .then(db => {
        console.log('DB connection successful.');
      });
    });
  }
});

if(require.main === module)
  module.exports.startServer(3000);
