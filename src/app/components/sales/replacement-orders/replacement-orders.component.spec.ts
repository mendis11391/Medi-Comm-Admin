import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementOrdersComponent } from './replacement-orders.component';

describe('ReplacementOrdersComponent', () => {
  let component: ReplacementOrdersComponent;
  let fixture: ComponentFixture<ReplacementOrdersComponent>;

  beforeEach(async(() => {
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
