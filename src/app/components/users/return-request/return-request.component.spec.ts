import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ReturnRequestComponent } from './return-request.component';

describe('ReturnRequestComponent', () => {
  let component: ReturnRequestComponent;
  let fixture: ComponentFixture<ReturnRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
