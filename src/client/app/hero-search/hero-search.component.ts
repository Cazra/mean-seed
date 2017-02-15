import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HeroSearchService } from './hero-search.service';
import { Hero } from '../shared/index';

@Component({
  selector: 'hero-search',
  templateUrl: 'app/hero-search/hero-search.component.html',
  styleUrls: ['app/hero-search/hero-search.component.css'],
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router) {}

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero._id];
    this.router.navigate(link);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300) // Wait for 300 ms pause in events
      .distinctUntilChanged() // Ignore if next search term is same as previous.
      .switchMap(term => {
        return term ?
          this.heroSearchService.search(term) :
          Observable.of<Hero[]>([])
      })
      .catch(error => {
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
