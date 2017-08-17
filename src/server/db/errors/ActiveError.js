'use strict';

/**
 * An error caused from a model not being soft-deleted.
 */
module.exports = class ActiveError extends Error {
  constructor() {
    super('The model is active.');

    // Use this to type-check the transpiled/obfuscated code:
    this.isActiveError = true;
  }
};
