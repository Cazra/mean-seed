import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a string into base64.
 */
@Pipe({ name: 'base64' })
export class Base64Pipe implements PipeTransform {
  transform(value: string): string {
    return btoa(value);
  }
}
