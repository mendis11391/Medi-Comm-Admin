import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRenewalOrderComponent } from './create-renewal-order.component';

describe('CreateRenewalOrderComponent', () => {
  let component: CreateRenewalOrderComponent;
  let fixture: ComponentFixture<CreateRenewalOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRenewalOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRenewalOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
