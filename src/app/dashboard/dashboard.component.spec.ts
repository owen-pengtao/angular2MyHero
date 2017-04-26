import { TestBed, ComponentFixture, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Router } from '@angular/router';

import { HeroService } from '../hero.service';
import { HEROES } from '../heroes/mock-heroes';
import { Hero } from '../hero';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../in-memory-data.service';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
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
        DashboardComponent
      ],
      providers: [
        HeroService,
        { provide: Router, useValue: router }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it(`should show 4 heroes, then select a hero, then go to hero detail`, async(() => {
    const compiled = fixture.debugElement.nativeElement;

    fixture.whenStable().then(() => {
      expect(compiled.querySelectorAll('.grid a').length).toEqual(4);

      compiled.querySelectorAll('.grid a')[0].click();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/detail', heroes.slice(1, 1)]);
    });
  }));
});
