import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import './rxjs-extensions';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';

  /**
   * Container for modal dialogs.
   */
  @ViewChild('dialogs') dialogs;

  /**
   * Remove the loading mask once the app is initialized.
   */
  ngOnInit(): void {
    // document.querySelector('#loadingMask').calssList.remove('active');
  }
}
