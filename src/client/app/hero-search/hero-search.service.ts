import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Hero } from '../shared/hero';

@Injectable()
export class HeroSearchService {

  constructor(private http: Http) {}

  search(term: string): Observable<Hero[]> {
    return this.http.get(`rest/heroes/?name=${term}`)
    .map((r: Response) => {
      return r.json().data as Hero[]
    });
  }
}
