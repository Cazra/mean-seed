import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hero, HeroService } from '../shared/index';

@Component({
  selector: 'my-heroes',
  templateUrl: 'app/heroes/heroes.component.html',
  styleUrls: ['app/heroes/heroes.component.css']
})
export class HeroesComponent implements OnInit {
  addingHero: boolean;
  selectedHero: Hero;
  heroes: Hero[];
  error: any;

  constructor(
    private router: Router,
    private heroService: HeroService) {}

  addHero(): void {
    this.addingHero = true;
    this.selectedHero = null;
  }

  close(savedHero: Hero): void {
    this.addingHero = false;
    if(savedHero)
      this.getHeroes();
  }

  deleteHero(hero: Hero, event: any): void {
    event.stopPropagation();

    console.log(hero);

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
