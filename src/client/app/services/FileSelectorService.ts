import { Injectable } from '@angular/core';

/**
 * @typedef {object} FileSelectorOptions
 * @property {boolean} [multiple=false]
 *           Flag to allow multiple files to be selected.
 * @property {string} [accept]
 *           The MIME-type for files that are allowed to be selected.
 */

/**
 * A service providing methods to select files using a file selection dialog
 * and read their contents.
 */
@Injectable()
export class FileSelectorService {

  /**
   * The invisible file input Element.
   */
  fileSelect: any;

  /**
   * The last registered change listener for fileSelect.
   */
  fileSelectListener: EventListener;

  /**
   * Downloads a blob of binary data as a file.
   * @param {Blob} blob
   * @param {string} fileName
   */
  downloadBlob(blob: Blob, fileName: string): void {
    let url = URL.createObjectURL(blob);

    let a: any = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  /**
   * Downloads a text file produced from a string.
   * @param {string} txt
   * @param {string} fileName
   */
  downloadText(txt: string, fileName: string): void {
    let blob = new Blob([txt], {type:'text/html'});
    this.downloadBlob(blob, fileName);
  }

  /**
   * Produces an ArrayBuffer containing the binary data for a File.
   * @param {File} file
   * @return {Promise<Uint8Array>}
   */
  getFileBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();

      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = () => {
        reject(fr.error);
      };

      fr.readAsArrayBuffer(file);
    }).
    then(data => {
      return new Uint8Array(<ArrayBuffer> data);
    });
  }

  /**
   * Produces a data URL containing the binary data of a File.
   * @param {File} file
   * @return {Promise<string>}
   */
  getFileDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();

      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = () => {
        reject(fr.error);
      };

      fr.readAsDataURL(file);
    })
  }

  /**
   * Selects files with a file selection dialog.
   * @param {FileSelectorOptions} options
   * @return {Promise<(File|File[])>}
   *         Returns a list iff options.multiple = true.
   */
  selectFile(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if(!this.fileSelect) {
        this.fileSelect = document.createElement('input');
        this.fileSelect.type = 'file';
      }

      if(options.multiple)
        this.fileSelect.multiple = true;
      if(options.accept)
        this.fileSelect.accept = options.accept;

      this.fileSelect.removeEventListener('change', this.fileSelectListener);
      this.fileSelectListener = fileEvt => {
        this.fileSelect.removeEventListener('change', this.fileSelectListener);

        let evtTarget: any = fileEvt.target;
        if(options.multiple)
          resolve(evtTarget.files);
        else
          resolve(evtTarget.files[0]);
      };
      this.fileSelect.addEventListener('change', this.fileSelectListener);

      this.fileSelect.value=null;
      this.fileSelect.click();
    });
  }
}
