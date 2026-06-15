import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaForm } from './meta-form';

describe('MetaForm', () => {
  let component: MetaForm;
  let fixture: ComponentFixture<MetaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MetaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
