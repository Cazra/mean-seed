import { ComponentRef, EventEmitter, Output } from '@angular/core';

/**
 * Base class for Dialog components.
 */
export class Dialog {
  private _cancel = new EventEmitter();
  private _resolve = new EventEmitter();

  /**
   * Cancels the dialog.
   */
  cancel(): void {
    this._cancel.emit();
  }

  /**
   * Subscribes an event handler for when the dialog is canceled.
   * @param {func} handler
   */
  onCancel(handler: any): void {
    this._cancel.subscribe(handler);
  }

  /**
   * Subscribes an event handler for when the dialog is resolved.
   * @param {func} handler
   */
  onResolve(handler: any): void {
    this._resolve.subscribe(handler);
  }

  /**
   * Resolves the dialog with some return value.
   * @param {any} value
   */
  resolve(value?: any): void {
    this._resolve.emit(value);
  }
}
