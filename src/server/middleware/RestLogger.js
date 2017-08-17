'use strict';

/**
 * This Express middleware prints each REST request received by the server
 * to the console.
 */
class RestLogger {

  /**
   * Creates the middleware.
   * @return {Express.MiddlewareFunction}
   */
  static middleware() {
    return (req, res, next) => {
      console.log('REST_LOGGER: ' + req.method + ': ' + req.originalUrl);
      next();
    };
  }
}
module.exports = RestLogger;
