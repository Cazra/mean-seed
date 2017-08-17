import { Injectable } from '@angular/core';

declare var mongoose: any;

@Injectable()
export class SystemService {
  private SERVICE_URL = 'system-info';

  info: any;

  constructor() {
    this.getSystemInfo();
  }

  /**
   * Downloads the contents of a static file on the web client's server.
   * @param {string} path
   *        The path to the static file.
   * @param {string} [type='text']
   *        The MIME type of the file.
   *        E.g. "text", "arraybuffer", "json"...
   */
  getStaticFile(path: string, responseType: string = 'text'): Promise<any> {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        resolve(xhr.response);
      });
      xhr.addEventListener('error', () => {
        reject(new Error(xhr.response));
      });
      xhr.responseType = responseType;

      xhr.open('GET', path);
      xhr.send();
    });
  }

  /**
   * Gets meta-information about the Web Client GUI from its server.
   * @return {Promise<object>}
   */
  getSystemInfo(): Promise<any> {
    if(this.info)
      return Promise.resolve(this.info);
    else {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.addEventListener('load', () => {
          console.log(xhr.response);
          this.info = xhr.response;
          resolve(xhr.response);
        });
        xhr.addEventListener('error', () => {
          reject(new Error(xhr.response));
        });

        xhr.open('GET', this.SERVICE_URL);
        xhr.send();
      });
    }
  }
};
