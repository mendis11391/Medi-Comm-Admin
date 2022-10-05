import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ReplacementOrderComponent } from './replacement-order.component';

describe('ReplacementOrderComponent', () => {
  let component: ReplacementOrderComponent;
  let fixture: ComponentFixture<ReplacementOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
