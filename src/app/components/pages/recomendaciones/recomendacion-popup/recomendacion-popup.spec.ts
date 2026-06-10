import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendacionPopup } from './recomendacion-popup';

describe('RecomendacionPopup', () => {
  let component: RecomendacionPopup;
  let fixture: ComponentFixture<RecomendacionPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(RecomendacionPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
