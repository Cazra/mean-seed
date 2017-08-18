import {
  Component,
  ElementRef,
  OnInit
} from '@angular/core';

import { Dialog } from './Dialog';
import { UtilService } from '../services';

@Component({
  selector: 'input-number-dialog',
  templateUrl: 'app/shared/dialogs/InputNumberDialog.html'
})
export class InputNumberDialog extends Dialog {
  message: string;
  value: number;

  constructor(
    private elemRef: ElementRef,
    private utilService: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    // Put focus on the input element.
    this.utilService.waitCycle()
    .then(() => {
      let input = this.elemRef.nativeElement.querySelector('input');
      input.focus();
    });
  }
}
