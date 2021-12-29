import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalAccessoriesComponent } from './digital-accessories.component';

describe('DigitalAccessoriesComponent', () => {
  let component: DigitalAccessoriesComponent;
  let fixture: ComponentFixture<DigitalAccessoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalAccessoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
