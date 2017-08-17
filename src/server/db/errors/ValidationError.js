'use strict';

/**
 * An error caused by a failed validation.
 * @memberof errors
 * @extends Error
 */
module.exports = class ValidationError extends Error {
  constructor(msg) {
    super(msg);

    // Use this to type-check the transpiled/obfuscated code:
    this.isValidationError = true;
  }
};
