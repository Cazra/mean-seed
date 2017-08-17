import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a string into base64.
 */
@Pipe({ name: 'decodeHex' })
export class DecodeHexPipe implements PipeTransform {
  transform(hex: string): number {
    return parseInt(hex, 16);
  }
}
