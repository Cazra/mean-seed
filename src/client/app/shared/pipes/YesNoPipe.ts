import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a boolean value to yes or no.
 */
@Pipe({ name: 'yesNo' })
export class YesNoPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'yes' : 'no';
  }
}
