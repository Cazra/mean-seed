import { Injectable } from '@angular/core';

import { FileSelectorService } from './FileSelectorService';
import { SystemService } from './SystemService';

declare var mongoose: any;
declare var _: any;

/**
 * @typedef {object} ApiCallOptions
 * @property {map<string, string>} [headers]
 *            The request headers.
 * @property {string} [requestType='json']
 *           The data format for the request body. This can be any
 *           appropriate value for XMLHttpRequest.responseType.
 * @property {string} [responseType]
 *           Any appropriate value for XMLHttpRequest.responseType.
 * @property {function} [onProgress]
 *           Handler for progress events. Accepts a XHR progress event as
 *           its argument.
 * @property {any} [body]
 *           The content for the request body.
 */


/**
 * This service provides an interface for making asynchronous calls to the
 * Hyperion Web Server API.
 */
@Injectable()
export class RestService {

  private _baseUrl: string;

  constructor(
    private systemService: SystemService,
    private fileSelectorService: FileSelectorService) {
    this.getBaseUrl();
  }

  /**
   * Makes an AJAX call.
   * @param {string} method
   *        The HTTP method for the service.
   * @param {string} path
   *        The restful service path.
   * @param {ApiCallOptions} [options]
   * @return {Promise<XMLHttpRequest>}
   *         Contains the response data for the call.
   */
  _ajax(method: string, path: string, options?: any): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
      options = options || {};
      _.defaults(options, {
        headers: {}
      });

      // Prepare the request body.
      if(options.requestType === 'json') {
        this._prepareJsonBody(options);
      }
      else if(['arraybuffer', 'blob'].includes(options.requestType)) {
        options.headers['content-type'] = 'application/octet-binary';
      }

      // Create the AJAX call.
      let xhr = new XMLHttpRequest();
      xhr.open(method, path);

      // Set any request headers.
      if(options.headers) {
        _.each(options.headers, (value, header) => {
          xhr.setRequestHeader(header, value);
        });
      }
      if(options.responseType)
        xhr.responseType = options.responseType;

      // Handle progress events if we are given a handler for them.
      if(options.onProgress)
        xhr.addEventListener('progress', options.onProgress);

      // Success handler
      xhr.addEventListener('load', () => {
        if(xhr.status === 200)
          resolve(xhr);
        else {
          console.log(xhr);
          reject(
            new Error(xhr.status + ': ' + (xhr.response || xhr.statusText)));
        }
      });

      // Error handlers
      xhr.addEventListener('error', () => {
        console.log(xhr);
        reject(new Error(xhr.response));
      });
      xhr.addEventListener('abort', () => {
        reject(new Error('Aborted: ' + xhr.response));
      });

      xhr.send(options.body);
    });
  }

  /**
   * Calls one of the Web Server API's restful services.
   * @param {string} method
   *        The HTTP method for the service.
   * @param {string} path
   *        The restful service path.
   * @param {ApiCallOptions} [options]
   * @return {Promise<XMLHttpRequest>}
   *         Contains the response data for the call.
   */
  callApi(method: string, path: string, options?: any): Promise<XMLHttpRequest> {
    return this.getBaseUrl()
    .then(baseUrl => {
      return this._ajax(method, baseUrl + path, options);
    });
  }

  /**
   * Calls one of the Web Server API's restful services to get binary data.
   * @param {string} method
   *        The HTTP method for the service.
   * @param {string} path
   *        The restful service path.
   * @param {ApiCallOptions} [options]
   * @return {Promise<ArrayBuffer>}
   *         Contains the response data for the call.
   */
  callBinaryApi(method: string, path: string, options?: any):
      Promise<ArrayBuffer> {
    options = options || {};
    options.responseType = 'arraybuffer';
    return this.callApi(method, path, options)
    .then(xhr => {
      return xhr.response;
    });
  }

  /**
   * Calls one of the Web Server API's restful services to get JSON data.
   * @param {string} method
   *        The HTTP method for the service.
   * @param {string} path
   *        The restful service path.
   * @param {ApiCallOptions} [options]
   * @return {Promise<any>}
   *         Contains the response data for the call.
   */
  callJsonApi(method: string, path: string, options?: any): Promise<any> {
    options = options || {};
    options.responseType = 'json';
    return this.callApi(method, path, options)
    .then(xhr => {
      return xhr.response;
    });
  }

  /**
   * Calls one of the Web Server API's paginated search services.
   * This supports parameters for searching, pagination, and sorting.
   * @param {string} path
   *        The restful service path (without query information for
   *        pagination/sorting).
   * @param {SearchOptions} searchOptions
   *        An object containing the search, pagination, and sort parameters.
   * @param {ApiCallOptions} [options]
   * @return {Promise<PaginatedSearchResults>}
   *        Contains the search results.
   */
  callJsonSearchApi(path: string, searchOptions: any, options?: any):
  Promise<any[]> {
      options = options || {};
      searchOptions = searchOptions || {};
      let params = searchOptions.params || {};
      let paging = searchOptions.paging || {};
      _.defaults(paging, {
        page: 1,
        limit: 20
      });
      let sorting = searchOptions.sorting || {};
      let fullPath = `${path}?page=${paging.page}&limit=${paging.limit}`;
      if(sorting.field)
        fullPath += `&sort=${sorting.field},${sorting.direction}`;

      _.extend(options, {
        body: {
          params,
          paging,
          sorting
        },
        requestType: 'json'
      });
      return this.callJsonApi('POST', fullPath, options);
  }

  /**
   * Calls one of the Web Server API's restful services to get string data.
   * @param {string} method
   *        The HTTP method for the service.
   * @param {string} path
   *        The restful service path.
   * @param {ApiCallOptions} [options]
   * @return {Promise<string>}
   *         Contains the response data for the call.
   */
  callStringApi(method: string, path: string, options?: any): Promise<any> {
    options = options || {};
    options.responseType = 'text';
    return this.callApi(method, path, options)
    .then(xhr => {
      return xhr.response;
    });
  }

  /**
   * Downloads a file from one of the Web Server API's restful services.
   * Downloads are always a GET request.
   * @param {string} method
   *        The HTTP method for the service.
   * @param {string} path
   *        The restful service path.
   * @param {string} downloadName
   *        The default name for the downloaded file.
   * @param {ApiCallOptions} [options]
   * @return {Promise<ArrayBuffer>}
   *         Contains the response data for the call.
   */
  download(path: string, downloadName: string, options?: any): Promise<any> {
    return this.callBinaryApi('GET', path, options)
    .then(buffer => {
      let blob = new Blob([buffer], {type: 'application/octet-binary'});
      this.fileSelectorService.downloadBlob(blob, downloadName);
      return buffer;
    });
  }

  /**
   * Gets the base URL for the Hyperion RESTful API.
   * @return {Promise<String>}
   */
  getBaseUrl(): Promise<string> {
    if(this._baseUrl)
      return Promise.resolve(this._baseUrl);
    else
      return this.systemService.getSystemInfo()
      .then(info => {
        let host = info.api.host;
        let port = info.api.port;
        this._baseUrl = `http://${host}:${port}/rest/`;
        return this._baseUrl;
      });
  }

  /**
   * Gets the base URL for the Web Server hosting the Hyperion RESTful API.
   * This depends on us completing the initial asynchronous call to get the
   * Web Server API's port, so don't call this until we are in a state where
   * that is initialized.
   * @return {String}
   */
  getHostUrl(): string {
    if(!this._baseUrl)
      throw new Error('Tried to get cached host URL before it was available.');
    return this._baseUrl.replace('/rest/','');
  }

  /**
   * Prepares a request body containing JSON data.
   * @private
   * @param {ApiCallOptions} [options]
   */
  _prepareJsonBody(options: any) {
    options.headers['content-type'] = 'application/json';

    // Convert Mongoose documents into objects before sending them.
    if(options.body instanceof mongoose.Document)
      options.body = options.body.toObject();
    else if(_.isArray(options.body) &&
      options.body[0] instanceof mongoose.Document)
      options.body = _.map(options.body, doc => {
        return doc.toObject();
      });

    options.body = JSON.stringify(options.body);
  }

  /**
   * Uploads a blob of data.
   * Uploads are always a POST request.
   * @param {string} path
   *        The restful service path.
   * @param {Blob} data
   *        The binary data being uploaded.
   * @param {ApiCallOptions} [options]
   * @return {Promise<object>}
   */
  upload(path: string, data: Blob, options?: any): Promise<any> {
    options = options || {};
    options.requestType = 'blob';
    options.body = data;
    return this.callJsonApi('POST', path, options);
  }
};
