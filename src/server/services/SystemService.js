'use strict';

/**
 * A service providing system information about the Web Client.
 */
class SystemService {
  /**
   * Gets the configured system information.
   * @type {Promise<object>}
   */
  static get systemInfo() {
    return Promise.resolve({
      version: '1.0.0',
      api: {
        host: 'localhost',
        port: '1337'
      }
    });
  }

  /**
   * Provides system information about the Hyperion Web GUI Client.
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  static getSystemInfo(req, res) {
    SystemService.systemInfo
    .then(info => {
      res.send(info);
    });
  }
}
module.exports = SystemService;
