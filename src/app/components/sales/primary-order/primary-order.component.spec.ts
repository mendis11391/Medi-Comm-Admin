import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryOrderComponent } from './primary-order.component';

describe('PrimaryOrderComponent', () => {
  let component: PrimaryOrderComponent;
  let fixture: ComponentFixture<PrimaryOrderComponent>;

  beforeEach(async(() => {
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
