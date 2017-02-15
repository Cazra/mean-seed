import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { DashboardComponent } from './dashboard/index';
import { HeroDetailComponent } from './hero-detail/index';
import { HeroSearchComponent } from './hero-search/index';
import { HeroService } from './shared/index';
import { HeroesComponent } from './heroes/index';

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
    HeroesComponent
  ],
  providers: [
    HeroService
  ],
  bootstrap: [ AppComponent ] // Identifies the root component to bootstrap on start-up.
})
export class AppModule {};
