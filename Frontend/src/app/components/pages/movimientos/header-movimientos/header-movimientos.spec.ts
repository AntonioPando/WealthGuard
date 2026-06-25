import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMovimientos } from './header-movimientos';

describe('HeaderMovimientos', () => {
  let component: HeaderMovimientos;
  let fixture: ComponentFixture<HeaderMovimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMovimientos],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderMovimientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
