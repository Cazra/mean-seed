'use strict';

/**
 * An error caused by bad/out-of-bounds parameters given for search pagination.
 */
module.exports = class PaginationError extends Error {
  constructor() {
    super('Pagination out of bounds.');

    // Use this to type-check the transpiled/obfuscated code:
    this.isPaginationError = true;
  }
};
