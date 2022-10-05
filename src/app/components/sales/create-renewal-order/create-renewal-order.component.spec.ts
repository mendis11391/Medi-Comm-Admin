import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CreateRenewalOrderComponent } from './create-renewal-order.component';

describe('CreateRenewalOrderComponent', () => {
  let component: CreateRenewalOrderComponent;
  let fixture: ComponentFixture<CreateRenewalOrderComponent>;

  beforeEach(waitForAsync(() => {
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
