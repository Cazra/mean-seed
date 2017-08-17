'use strict';

const _ = require('underscore');

/**
 * Express middleware which tries to parse the request body as JSON.
 * If it could not be parsed (e.g. the body contains binary data), then it is
 * allowed to pass through as-is.
 */
class JsonParser {

  /**
   * Creates the middleware.
   * @return {Express.MiddlewareFunction}
   */
  static middleware() {
    return (req, res, next) => {
      try {
        if(req.headers['content-type'] === 'application/json') {
          let chunks = [];
          req.on('data', chunk => {
            chunks.push(chunk);
          });
          req.on('end', () => {
            let raw = Buffer.concat(chunks);
            try {
              let json = JSON.parse(raw);
              req.body = json;
            }
            catch(err) {
              console.error('JsonParser ERROR: ', err, raw.toString());
            }
            next();
          });
          req.on('error', err => {
            console.warn(err);
            res.sendStatus(400);
          });
        }
        else
          next();
      }
      catch(err) {
        // It's fine if we couldn't parse it as JSON. Let it through as-is.
        _.noop(err);
        next();
      }

    };
  }
}
module.exports = JsonParser;
