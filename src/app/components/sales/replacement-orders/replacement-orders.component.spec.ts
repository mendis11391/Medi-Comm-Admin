import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ReplacementOrdersComponent } from './replacement-orders.component';

describe('ReplacementOrdersComponent', () => {
  let component: ReplacementOrdersComponent;
  let fixture: ComponentFixture<ReplacementOrdersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
