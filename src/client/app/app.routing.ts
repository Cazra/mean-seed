import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/index';
import { HeroesComponent } from './heroes/index';
import { HeroDetailComponent } from './hero-detail/index';

const appRoutes: Routes = [
  {
    path: 'heroes',
    component: HeroesComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent
  }
];

export const routing = RouterModule.forRoot(appRoutes);
