import {
  Component,
  ElementRef,
  OnInit
} from '@angular/core';

import { Dialog } from './Dialog';
import { UtilService } from '../services';

@Component({
  selector: 'input-text-dialog',
  templateUrl: 'app/shared/dialogs/InputTextDialog.html'
})
export class InputTextDialog extends Dialog {
  message: string;
  value: string;

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
