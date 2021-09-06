import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPanelComponent } from './orders-panel.component';

describe('OrdersPanelComponent', () => {
  let component: OrdersPanelComponent;
  let fixture: ComponentFixture<OrdersPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
