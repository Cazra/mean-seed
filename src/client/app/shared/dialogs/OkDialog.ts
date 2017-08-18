import { Component } from '@angular/core';

import { Dialog } from './Dialog';

@Component({
  selector: 'ok-dialog',
  templateUrl: 'app/shared/dialogs/OkDialog.html'
})
export class OkDialog extends Dialog {
  message: string;
}
