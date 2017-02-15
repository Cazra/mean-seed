import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Hero } from './hero.model';

@Injectable()
export class HeroService {
  private heroesUrl = 'rest/heroes'; // URL to web api

  constructor(private http: Http) {}

  // Deletes a Hero.
  delete(hero: Hero): Promise<Response> {
    let headers = new Headers();
    let url = `${this.heroesUrl}/${hero._id}`;

    return this.http.delete(url)
      .toPromise()
      .catch(this.handleError);
  }

  getHero(id: number): Promise<Hero> {
    return this.getHeroes()
      .then(heroes => heroes.find(hero => hero._id === id));
  }

  getHeroes(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
      .toPromise()
      .then(response => response.json().data as Hero[])
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  // Adds a new Hero.
  post(hero: Hero): Promise<Hero> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(
        this.heroesUrl,
        JSON.stringify(hero),
        {headers: headers}
      )
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  // Update an existing Hero.
  put(hero: Hero): Promise<Hero> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.heroesUrl}/${hero._id}`;

    return this.http.put(
      url,
      JSON.stringify(hero),
      {headers: headers}
    )
    .toPromise()
    .then(() => hero)
    .catch(this.handleError);
  }

  // Upserts a hero.
  save(hero: Hero): Promise<Hero> {
    if(hero._id)
      return this.put(hero);
    return this.post(hero);
  }
}
