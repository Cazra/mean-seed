import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hero, HeroService } from '../shared/hero';
import {
  InputSelectDialog
} from '../shared/dialogs';
import { DialogsService } from '../shared/services';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard/dashboard.component.html',
  styleUrls: ['app/dashboard/dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    private router: Router,
    private heroService: HeroService,
    private dialogsService: DialogsService
  ) {}

  ngOnInit(): void {
    this.heroService.getHeroes()
      .then(heroes => this.heroes = heroes.slice(1,5));
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero._id];
    this.router.navigate(link);
  }

  testDialog(): void {
    this.dialogsService.show(InputSelectDialog, {
      message: 'This is a test.',
      options: [
        { value: 1, view: 'one' },
        { value: 2, view: 'two' },
        { value: 3, view: 'three' }
      ]
    })
    .then(value => {
      console.log(value);
    });
  }
}
