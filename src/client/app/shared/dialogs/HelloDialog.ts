import { Component, ComponentRef } from '@angular/core';

import { Dialog } from './Dialog';

@Component({
  selector: 'hello-world-dialog',
  templateUrl: 'app/shared/dialogs/HelloDialog.html'
})
export class HelloDialog extends Dialog {
  testInput: any;
}
