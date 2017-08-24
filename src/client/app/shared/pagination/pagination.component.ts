import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * This component provides a navigation bar for a paginated list of
 * objects.
 */
@Component({
  selector: 'pagination-bar',
  templateUrl: 'app/shared/pagination/pagination.component.html',
  styleUrls: ['app/shared/pagination/pagination.component.css']
})
export class PaginationComponent {
  @Input() paging: any;
  @Output() choosePage = new EventEmitter();

  constructor() {}

  /**
   * Handler for a page button being clicked.
   * @param {int} pageNum
   *        The page number that was selected.
   */
  onPageClick(pageNum: number): void {
    this.choosePage.emit(pageNum);
  }
}
