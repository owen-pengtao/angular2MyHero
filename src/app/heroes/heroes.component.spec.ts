import { TestBed, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Router } from '@angular/router';

import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { HEROES } from './mock-heroes';
import { Hero } from '../hero';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../in-memory-data.service';

describe('HeroesComponent', () => {
  const heroes: Hero[] = HEROES;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        RouterTestingModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
      ],
      declarations: [
        HeroesComponent
      ],
      providers: [
        HeroService,
        { provide: Router, useValue: router }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HeroesComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should select a hero`, () => {
    const fixture = TestBed.createComponent(HeroesComponent);
    const app = fixture.debugElement.componentInstance;

    app.onSelect(heroes[0]);
    expect(app.selectedHero).toEqual(heroes[0]);
  });

  it(`should get a hero`, () => {
    const fixture = TestBed.createComponent(HeroesComponent);
    const app = fixture.debugElement.componentInstance;

    spyOn(app, 'getHeroes');
    app.getHeroes();

    expect(app.getHeroes).toHaveBeenCalled();
  });

  it(`should go to a hero detail`, async(() => {
    const fixture = TestBed.createComponent(HeroesComponent);
    const app = fixture.debugElement.componentInstance;

    app.selectedHero = heroes[0];
    app.gotoDetail();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/detail', heroes[0].id]);
  }));

  it(`should show hero list, then select a hero, then go to hero detail`, async(() => {
    const fixture = TestBed.createComponent(HeroesComponent);
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    router.navigate(['/heroes']);

    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
      expect(compiled.querySelectorAll('ul.heroes li').length).toEqual(heroes.length);

      compiled.querySelectorAll('ul.heroes li')[0].click();
      fixture.detectChanges();
      expect(app.selectedHero).toEqual(heroes[0]);

      compiled.querySelector('.detailButton').click();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/detail', heroes[0].id]);
    });
  }));
});
