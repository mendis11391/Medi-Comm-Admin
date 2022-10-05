import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CancelledOrdersComponent } from './cancelled-orders.component';

describe('CancelledOrdersComponent', () => {
  let component: CancelledOrdersComponent;
  let fixture: ComponentFixture<CancelledOrdersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
