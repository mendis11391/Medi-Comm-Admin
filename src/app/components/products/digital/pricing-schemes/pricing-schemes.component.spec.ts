import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PricingSchemesComponent } from './pricing-schemes.component';

describe('PricingSchemesComponent', () => {
  let component: PricingSchemesComponent;
  let fixture: ComponentFixture<PricingSchemesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingSchemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
