import { ApplicationRef, Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

  constructor(private appRef: ApplicationRef) {}

  /**
   * Displays a global modal dialog and returns its result (if any)
   * in a Promise.
   * @param {Type<Dialog>} clazz
   *        The constructor for the dialog.
   * @param {map<string, any>} [inputs]
   *        The map of  @Input data to assign to the dialog that is created.
   * @return {Promise<any>}
   *        Contains the result of the dialog, if any. If the dialog is
   *        canceled, then the Promise is left unresolved.
   */
  show(clazz: any, inputs?: any): Promise<any> {
    return this.appRef.components[0].instance.dialogs.show(clazz, inputs);
  }
}
