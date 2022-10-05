import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PrimaryOrderComponent } from './primary-order.component';

describe('PrimaryOrderComponent', () => {
  let component: PrimaryOrderComponent;
  let fixture: ComponentFixture<PrimaryOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
