'use strict';

const mongoose = require('mongoose');
const _ = require('underscore');

const errors = require('./errors');

mongoose.Promise = Promise;

/**
 * The module governing common functions on our DTO models.
 */
module.exports = class Models {

  /**
   * Counts the total number of matches for a model search.
   * @param {Mongoose.Model} Model
   * @param {object} [conditions]
   * @return {Promise<int>}
   */
  static count(Model, conditions) {
    conditions = conditions || {};

    return Model.find(conditions)
    .count();
  }

  /**
   * Creates a persisted model if it doesn't already exist.
   * @param {Mongoose.Model} Model
   * @param {object} data
   * @param {object} [options]
   * @return {Promise<Mongoose.Document>}
   */
  static create(Model, data, options) {
    options = options || {};
    let validData;

    // Validate the data, also filling in any default values.
    return Models.validate(Model, data)
    .then(data => {
      validData = data;
    })

    // Check that the model does not already exists.
    .then(() => {
      return Model.findById(validData._id);
    })
    .then(model => {
      if(model)
        throw new errors.DuplicateError();
    })

    // Run any middleware for the model creation.
    .then(() => {
      if(options.middleware)
        return Promise.resolve()
        .then(() => {
          return options.middleware(validData);
        })

        // Revalidate the data, in case it was changed by the middleware.
        .then(middleData => {
          return Models.validate(Model, middleData)
          .catch(err => {
            throw new errors.MiddlewareError(err.message);
          });
        })
        .then(data => {
          validData = data;
        });
    })

    // Persist the model.
    .then(() => {
      return Model.create(validData);
    });
  }

  /**
   * An object used to lazilly access a defined Mongoose Model.
   * @typedef {object} ModelAccessor
   * @property {function} model
   *           This accessor function takes no arguments and returns the
   *           model, defining it first if it hasn't been defined already.
   */

  /**
   * Defines a Mongoose model and provides a accessor function to access it.
   * The model is actually defined only the first time its accessor is invoked.
   * @param {String} name
   *        The name of the Mongoose model.
   * @param {func} schemaCreator
   *        A function that produces the schema for the model.
   * @param {object} [options]
   * @return {ModelAccessor}
   */
  static define(name, schemaCreator, options) {
    options = options || {};
    return {
      model: () => {
        try {
          // This will throw a MissingSchemaError if the model wasn't already
          // defined. If the model is already defined, this will return the
          // defined model to avoid OverwriteModelErrors.
          return mongoose.model(name);
        }
        catch(err) {
          _.noop(err);
          let schema = schemaCreator();
          if(options.persist)
            schema.add({
              active: {
                type: Boolean,
                default: true
              },
              documentCreated: {
                type: Date,
                default: () => {
                  return new Date();
                }
              },
              documentModified: {
                type: Date,
                default: () => {
                  return new Date();
                }
              }
            });

          return mongoose.model(name, schema);
        }
      }
    };
  }

  /**
   * Hard-deletes a model, given its ID.
   * @param {Mongoose.Model} Model
   * @param {string} id
   * @return {Promise<Mongoose.Document>} The deleted model.
   */
  static delete(Model, id) {
    return Model.findById(id)
    .then(model => {
      // Make sure the model exists and isn't already soft-deleted.
      if(!model)
        throw new errors.DoesNotExistError();
      return model.remove()
      .then(model => {
        model.active = false;
        return model;
      });
    });
  }

  /**
   * Gets the metadata for pagination in a search.
   * @private
   * @param {int} count
   * @param {int} page
   * @param {int} limit
   * @return {object}
   */
  static _getPaginationInfo(count, page, limit) {
    let firstIndex = limit*(page-1);

    // The first index must be in the range [0,count).
    if(firstIndex < 0 || (count > 0 && firstIndex >= count))
      throw new errors.PaginationError();

    // Compile some pagination results info.
    let pageCount = Math.ceil(count/limit);
    let prevPage, nextPage;
    if(page > 1)
      prevPage = page - 1;
    if(page < pageCount)
      nextPage = page + 1;

    return {
      count,
      firstIndex,
      limit,
      nextPage,
      page,
      pageCount,
      prevPage
    };
  }

  /**
   * Process a list of Mongoose sort objects into sort tuples.
   * This allows such sorting specifications to be applied in
   * some order such as sorting by type first, then by name.
   * @private
   * @param {Queries.request} query
   * @return {Object}
   */
  static _getSortOrder(query) {
    let sorting = query.sorting;
    if(!sorting || _.size(sorting) === 0)
      return;

    if(!_.isArray(sorting))
      sorting = [sorting];

    // Convert our ordered sort list into a form that can
    // be processed by Mongo's aggregation framework.
    return _.reduce(sorting, (memo, sort) => {
      let field = sort.field;
      let direction = sort.direction;
      if(_.isString(direction)) {
        direction = direction.toLowerCase();
        if(direction.startsWith('desc'))
          direction = -1;
        else
          direction = 1;
      }

      memo[field] = direction;
      return memo;
    }, {});
  }

  /**
   * Gets the results for a paginated search query over a collection.
   * @param {Mongoose.Model} Model
   * @param {Queries.request} query
   * @return {Promise<Object[]>}
   *         The list of documents returned from the search.
   */
  static searchQuery(Model, query) {
    let sorting = query.sorting;
    let sortOrder = Models._getSortOrder(query);
    let limit = query.paging.limit;
    let page = query.paging.page;
    let preAggr = (query.aggregation && query.aggregation.pre) || [];
    let postAggr = (query.aggregation && query.aggregation.post) || [];

    let result = {
      sorting
    };

    // Compile the prefix for the aggregations.
    preAggr = preAggr.concat([
      { $match: query.data }
    ]);

    // Use an aggregation to get the total number of search matches.
    return Model.aggregate(preAggr.concat([
      { $count: 'count' }
    ]))
    .then(countResult => {
      let count = (countResult && countResult[0] &&
        countResult[0].count) || 0;

      // Compile some pagination results info.
      result.paging =
        Models._getPaginationInfo(count, page, limit);

      // Use an aggregation to do our paginated search.
      if(count > 0) {
        let searchAggr = _.clone(preAggr);
        if(sortOrder)
          searchAggr.push({ $sort: sortOrder });
        return Model.aggregate(searchAggr.concat([
          { $skip: result.paging.firstIndex },
          { $limit: limit }
        ])
        .concat(postAggr));
      }
      else
        return [];
    })
    .then(data => {
      data = _.map(data, item => {
        return new Model(item);
      });

      // Compile and return our final paginated results data.
      let lastIndex = Math.min(result.paging.count - 1,
        result.paging.firstIndex + data.length - 1);
      _.extend(result, {
        data
      });
      _.extend(result.paging, {
        lastIndex
      });
      return result;
    });
  }

  /**
   * Soft-deletes a persisted model, given its ID.
   * @param {Mongoose.Model} Model
   * @param {string} id
   *        The ID of the model.
   * @return {Promise<Mongoose.Document>}
   *         The soft-deleted model.
   */
  static softDelete(Model, id) {
    return Model.findById(id)
    .then(model => {

      // Make sure the model exists and isn't already soft-deleted.
      if(!model)
        throw new errors.DoesNotExistError();
      else if(!model.active)
        throw new errors.InactiveError();

      model.active = false;
      model.documentModified = new Date();
      return model.save();
    });
  }

  /**
   * Restores a soft-deleted persisted model, given its ID.
   * @param {Mongoose.Model} Model
   * @param {string} id
   *        The ID of the model.
   * @return {Promise<Mongoose.Document>}
   *         The restored model.
   */
  static softRestore(Model, id) {
    return Model.findById(id)
    .then(model => {

      // Make sure the model exists and isn't already restored.
      if(!model)
        throw new errors.DoesNotExistError();
      else if(model.active)
        throw new errors.ActiveError();

      model.active = true;
      model.documentModified = new Date();
      return model.save();
    });
  }

  /**
   * Updates a persisted model's data.
   * @param {Mongoose.Model} Model
   * @param {object} data
   * @param {ModelOperationOptions} [options]
   * @return {Promise<Mongoose.Document>}
   */
  static update(Model, data, options) {
    options = options || {};
    let validData, oldData;
    let id = data._id;

    // Validate the new data.
    return Models.validate(Model, data)
    .then(data => {
      validData = data;
    })

    // Make sure that the model exists.
    .then(() => {
      return Model.findById(validData._id);
    })
    .then(model => {
      if(!model)
        throw new errors.DoesNotExistError();
      else if(!model.active)
        throw new errors.InactiveError();

      oldData = model.toObject();
    })

    // Run middleware, if any.
    .then(() => {
      if(options.middleware)
        return Promise.resolve()
        .then(() => {
          return options.middleware(validData, oldData);
        })

        // Revalidate the data, in case it was changed by the middleware.
        .then(middleData => {
          return Models.validate(Model, middleData)
          .catch(err => {
            throw new errors.MiddlewareError(err.message);
          });
        })
        .then(data => {
          validData = data;
        });
    })

    // Update the model.
    .then(() => {
      validData.documentModified = new Date();
      delete validData._id;
      return Model.update({ _id: id }, validData);
    })
    .then(() => {
      return Model.findById(id);
    });
  }

  /**
   * Validates JSON for a DTO or a list of DTOs.
   * @param {(string|Mongoose.Model)} Model
   * @param {(object|object[])} data
   *        The raw JSON for the DTO(s).
   * @return {Promise<Object>}
   *         If the DTO(s) is valid, then the Promise is resolved and contains
   *         the validated JSON for the DTO(s), including defaulted fields.
   *         Otherwise, the Promise is rejected.
   */
  static validate(Model, data) {
    // If a model name was provided instead of its class, try to look up its
    // class from the name.
    if(_.isString(Model))
      Model = mongoose.model(Model);

    // Decide whether to validate one or multiple.
    if(_.isArray(data))
      return Models._validateMultiple(Model, data);
    else
      return Models._validateSingle(Model, data);
  }

  /**
   * Validates the JSON for a list of DTOs.
   * @private
   * @param {Mongoose.Model} Model
   * @param {Object[]} dataList
   * @return {Promise<Object[]>}
   *         If all the DTOs are valid, then the Promise is resolved and
   *         contains the list of validated JSON.
   *         Otherwise, the Promise is rejected.
   */
  static _validateMultiple(Model, dataList) {
    let validations = _.map(dataList, data => {
      return Models._validateSingle(Model, data);
    });
    return Promise.all(validations);
  }

  /**
   * Validates the JSON for a single DTO.
   * @private
   * @param {Mongoose.Model} Model
   * @param {object} data
   * @return {Promise<Object>}
   *         If the DTO is valid, then the Promise is resolved and contains
   *         the validated JSON for the DTO, including defaulted fields.
   *         Otherwise, the Promise is rejected.
   */
  static _validateSingle(Model, data) {
    try {
      let dto = new Model(data);
      return dto.validate()
      .then(() => {
        return dto.toObject();
      })
      .catch(err => {
        let details = _.map(err.errors, (error) => {
          return error.message;
        }).join(', ');
        let msg = `${err.message}: ${details}`;
        throw new errors.ValidationError(msg);
      });
    }
    catch(err) {
      return Promise.reject(
        new errors.ValidationError(err.message)
      );
    }
  }
};
