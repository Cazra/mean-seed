import {
  Component,
  ElementRef,
  OnInit
} from '@angular/core';

import { Dialog } from './Dialog';
import { UtilService } from '../services';

interface SelectOption {
  value: any;
  view: string;
}

@Component({
  selector: 'input-select-dialog',
  templateUrl: 'app/shared/dialogs/InputSelectDialog.html'
})
export class InputSelectDialog extends Dialog {
  message: string;
  value: any;
  options: SelectOption[];

  constructor(
    private elemRef: ElementRef,
    private utilService: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    // Put focus on the select element.
    this.utilService.waitCycle()
    .then(() => {
      let select = this.elemRef.nativeElement.querySelector('select');
      select.focus();
    });
  }
}
