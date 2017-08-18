import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injectable,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { UtilService } from '../services/index';

declare var _: any;

@Component({
  selector: 'modal-dialogs',
  templateUrl: 'app/shared/dialogs/ModalDialogs.html',
  styleUrls: ['app/shared/dialogs/dialogs.css']
})
@Injectable()
export class ModalDialogs {
  @ViewChild('dialogContainer', {read: ViewContainerRef}) dialogContainer;
  dialog: any;

  constructor(
    private cfResolver: ComponentFactoryResolver,
    private utilService: UtilService
  ) {}

  /**
   * Displays a dialog and returns its result (if any) in a Promise.
   * @param {Type<Dialog>} clazz
   *        The constructor for the dialog.
   * @param {map<string, any>} [inputs]
   *        The map of  @Input data to assign to the dialog that is created.
   * @return {Promise<any>}
   *        Contains the result of the dialog, if any. If the dialog is
   *        canceled, then the Promise is left unresolved.
   */
  show(clazz: any, inputs?: any): Promise<any> {
    this.dialogContainer.clear();

    // Create the dialog in the dialog container.
    //let factory = this.cfResolver.resolveComponentFactory(clazz);

    //let injector = this.dialogContainer.injector;
    //let dialog = this.dialogContainer.createComponent(factory, 0, injector);
    let dialog: any = this.utilService.createDynamicComponent(clazz, this.dialogContainer);
    _.each(inputs, (value, key) => {
      dialog.instance[key] = value;
    });
    this.dialog = dialog;

    let focusable = dialog.location.nativeElement.querySelector('.focusable');
    if(focusable) {
      this.utilService.waitCycle()
      .then(() => {
        focusable.focus();
      }); // Defer focusing it until it finishes rendering.
    }

    // Resolve when the dialog completes.
    return new Promise((resolve, reject) => {
      dialog.instance.onCancel(() => {
        dialog.destroy();
        this.dialog = undefined;
      });

      dialog.instance.onResolve(value => {
        resolve(value);
        dialog.destroy();
        this.dialog = undefined;
      });
    });
  }
}
