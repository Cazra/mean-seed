'use strict';

/**
 * An error caused by a duplicate model.
 */
module.exports = class DuplicateError extends Error {
  constructor() {
    super('A duplicate model exists.');

    // Use this to type-check the transpiled/obfuscated code:
    this.isDuplicateError = true;
  }
};
