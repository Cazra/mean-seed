'use strict';

/**
 * An error caused by middleware.
 */
module.exports = class MiddlewareError extends Error {
  constructor(msg) {
    super(msg);

    // Use this to type-check the transpiled/obfuscated code:
    this.isMiddlewareError = true;
  }
};
