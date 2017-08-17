'use strict';

const SystemService = require('../services/SystemService');

class CORS {

  /**
   * Creates the middleware.
   * @return {Express.MiddlewareFunction}
   */
  static middleware() {
    return (req, res, next) => {
      SystemService.getSystemInfo()
      .then(info => {
        let host = info.options.client.host;
        let port = info.options.client.port;

        res.header('Access-Control-Allow-Origin', `http://${host}:${port}`);
        res.header('Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods',
          'POST, GET, PUT, OPTIONS, DELETE');
        next();
      });
    };
  }
}
module.exports = CORS;
