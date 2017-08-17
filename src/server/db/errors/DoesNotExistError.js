'use strict';

/**
 * An error relating to a persisted model not existing.
 */
module.exports = class DoesNotExistError extends Error {
  constructor() {
    super('The model does not exist.');

    // Use this to type-check the transpiled/obfuscated code:
    this.isDoesNotExistError = true;
  }
};
