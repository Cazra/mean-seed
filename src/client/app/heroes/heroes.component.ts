import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InputTextDialog } from '../shared/dialogs';
import { Hero, HeroService } from '../shared/hero';
import { DialogsService } from '../shared/services';

@Component({
  selector: 'my-heroes',
  templateUrl: 'app/heroes/heroes.component.html',
  styleUrls: ['app/heroes/heroes.component.css']
})
export class HeroesComponent implements OnInit {
  selectedHero: Hero;
  heroes: Hero[];
  error: any;

  constructor(
    private router: Router,
    private heroService: HeroService,
    private dialogsService: DialogsService
  ) {}

  addHero(): void {
    this.selectedHero = null;
    this.dialogsService.show(InputTextDialog, { message: 'Enter hero name:' })
    .then(name => {
      let hero = new Hero();
      hero.name = name;
      return this.heroService.save(hero);
    })
    .then(savedHero => {
      if(savedHero)
        this.getHeroes();
    })
    .catch(err => {
      this.error = err;
    });
  }

  deleteHero(hero: Hero, event: any): void {
    event.stopPropagation();

    this.heroService.delete(hero)
      .then(res => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if(this.selectedHero === hero)
          this.selectedHero = null;
      })
      .catch(error => this.error = error);
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .then(heroes => this.heroes = heroes);
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero._id]);
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    console.log(this, hero);
    this.selectedHero = hero;
  }
};
