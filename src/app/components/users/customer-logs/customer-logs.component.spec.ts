import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLogsComponent } from './customer-logs.component';

describe('CustomerLogsComponent', () => {
  let component: CustomerLogsComponent;
  let fixture: ComponentFixture<CustomerLogsComponent>;

  beforeEach(async(() => {
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
