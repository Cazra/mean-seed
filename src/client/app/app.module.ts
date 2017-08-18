import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { DashboardComponent } from './dashboard';
import { HeroDetailComponent } from './hero-detail';
import { HeroSearchComponent } from './hero-search';

import {
  ConfirmDialog,
  HelloDialog,
  InputNumberDialog,
  InputSelectDialog,
  InputTextDialog,
  ModalDialogs,
  OkDialog
} from './shared/dialogs';

import {
  Base64Pipe,
  ByteSizePipe,
  DecodeHexPipe,
  YesNoPipe
} from './shared/pipes';

import {
  DialogsService,
  FileSelectorService,
  RestService,
  SystemService,
  UtilService
} from './shared/services';

import { HeroService } from './shared/hero';
import { HeroesComponent } from './heroes';

@NgModule({
  imports: [
    BrowserModule, // Almost every application's root module should import BrowserModule.
    FormsModule,
    routing,
    HttpModule
  ],
  declarations: [ // Components and directives that belong to this module.
    AppComponent,
    DashboardComponent,
    HeroDetailComponent,
    HeroSearchComponent,
    HeroesComponent,

    ...[ // pipes
      Base64Pipe,
      ByteSizePipe,
      DecodeHexPipe,
      YesNoPipe
    ],

    ...[ // dialogs
      ConfirmDialog,
      HelloDialog,
      InputNumberDialog,
      InputSelectDialog,
      InputTextDialog,
      ModalDialogs,
      OkDialog
    ]
  ],

  // Any components that would be dynamically created (such as modular
  // dialogs) should go here.
  entryComponents: [
    ...[
      ConfirmDialog,
      HelloDialog,
      InputNumberDialog,
      InputSelectDialog,
      InputTextDialog,
      OkDialog
    ]
  ],

  // All injectables should go in here.
  providers: [
    HeroService,

    ...[ // shared services
      DialogsService,
      FileSelectorService,
      RestService,
      SystemService,
      UtilService
    ]
  ],

  // Identifies the root component to bootstrap on start-up.
  bootstrap: [ AppComponent ]
})
export class AppModule {};
