import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingRenewalsComponent } from './upcoming-renewals.component';

describe('UpcomingRenewalsComponent', () => {
  let component: UpcomingRenewalsComponent;
  let fixture: ComponentFixture<UpcomingRenewalsComponent>;

  beforeEach(async(() => {
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
