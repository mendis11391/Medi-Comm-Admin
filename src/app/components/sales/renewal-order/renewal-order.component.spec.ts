import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { RenewalOrderComponent } from './renewal-order.component';

describe('RenewalOrderComponent', () => {
  let component: RenewalOrderComponent;
  let fixture: ComponentFixture<RenewalOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
