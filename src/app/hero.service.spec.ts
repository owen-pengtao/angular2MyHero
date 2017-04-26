import { TestBed, inject, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { HeroService } from './hero.service';
import { HEROES } from './heroes/mock-heroes';
import { Hero } from './hero';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

describe('HeroService', () => {
  const heroes: Hero[] = HEROES;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
      ],
      providers: [
        HeroService
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  }));

  it('should create HeroService', inject([HeroService], (heroService: HeroService) => {
    expect(heroService).toBeTruthy();
  }));


  it('should get a hero', inject([HeroService], (heroService: HeroService) => {
    heroService.getHero(heroes[0].id).then((hero: Hero) => {
      expect(hero).toEqual(heroes[0]);
    });
  }));

  it('should get heroes', inject([HeroService], (heroService: HeroService) => {
    heroService.getHeroes().then((_heroes: Hero[]) => {
      expect(_heroes).toEqual(heroes);
    });
  }));

  it('should get a slow heroes', inject([HeroService], (heroService: HeroService) => {
    heroService.getHeroesSlowly().then((_heroes: Hero[]) => {
      expect(_heroes).toEqual(heroes);
    });
   }));

});
