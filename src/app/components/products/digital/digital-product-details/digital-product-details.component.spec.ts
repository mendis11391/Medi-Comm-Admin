import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalProductDetailsComponent } from './digital-product-details.component';

describe('DigitalProductDetailsComponent', () => {
  let component: DigitalProductDetailsComponent;
  let fixture: ComponentFixture<DigitalProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
