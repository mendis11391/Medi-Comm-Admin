import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { UpcomingRenewalsComponent } from './upcoming-renewals.component';

describe('UpcomingRenewalsComponent', () => {
  let component: UpcomingRenewalsComponent;
  let fixture: ComponentFixture<UpcomingRenewalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
