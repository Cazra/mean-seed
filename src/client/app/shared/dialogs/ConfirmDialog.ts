import { Component } from '@angular/core';

import { Dialog } from './Dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'app/shared/dialogs/ConfirmDialog.html'
})
export class ConfirmDialog extends Dialog {
  message: string;
}
