import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DepositsComponent } from './deposits.component';

describe('DepositsComponent', () => {
  let component: DepositsComponent;
  let fixture: ComponentFixture<DepositsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
