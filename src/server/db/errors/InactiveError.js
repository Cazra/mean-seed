'use strict';

/**
 * An error related to a model already being soft-deleted.
 */
module.exports = class InactiveError extends Error {
  constructor() {
    super('The model is inactive.');

    // Use this to type-check the transpiled/obfuscated code:
    this.isInactiveError = true;
  }
};
