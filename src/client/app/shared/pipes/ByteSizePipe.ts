import { Pipe, PipeTransform } from '@angular/core';

const KB = 1024;
const MB = KB*1024;

/**
 * Formats a byte quantity as bytes, Kilobytes, or Megabytes.
 */
@Pipe({ name: 'byteSize' })
export class ByteSizePipe implements PipeTransform {

  /**
   * Rounds a number to the neareset tenth.
   * @private
   */
  private _roundToTenths(value: number): number {
    return Math.round(value*10)/10;
  }

  transform(value: number): string {
    if(value > MB)
      return this._roundToTenths(value/MB) + ' MB';
    else if(value > KB)
      return this._roundToTenths(value/KB) + ' KB';
    else
      return value + ' bytes'
  }

}
