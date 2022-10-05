import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CustomerLogsComponent } from './customer-logs.component';

describe('CustomerLogsComponent', () => {
  let component: CustomerLogsComponent;
  let fixture: ComponentFixture<CustomerLogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
