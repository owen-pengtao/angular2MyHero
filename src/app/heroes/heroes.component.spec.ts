import { TestBed, ComponentFixture, async, inject, tick, fakeAsync } from '@angular/core/testing';
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
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  const heroes: Hero[] = HEROES;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the heroes component', () => {
    expect(component).toBeTruthy();
  });

  it(`should select a hero`, () => {
    component.onSelect(heroes[0]);
    expect(component.selectedHero).toEqual(heroes[0]);
  });

  it(`should get a hero`, () => {
    spyOn(component, 'getHeroes');
    component.getHeroes();

    expect(component.getHeroes).toHaveBeenCalled();
  });

  it(`should go to a hero detail`, async(() => {
    component.selectedHero = heroes[0];
    component.gotoDetail();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/detail', heroes[0].id]);
  }));

  it(`should show hero list, then select a hero, then go to hero detail`, async(() => {
    const compiled = fixture.debugElement.nativeElement;
    router.navigate(['/heroes']);

    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
      expect(compiled.querySelectorAll('ul.heroes li').length).toEqual(heroes.length);

      compiled.querySelectorAll('ul.heroes li')[0].click();
      fixture.detectChanges();
      expect(component.selectedHero).toEqual(heroes[0]);

      compiled.querySelector('.detailButton').click();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/detail', heroes[0].id]);
    });
  }));
});
