import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DigitalAccessoriesComponent } from './digital-accessories.component';

describe('DigitalAccessoriesComponent', () => {
  let component: DigitalAccessoriesComponent;
  let fixture: ComponentFixture<DigitalAccessoriesComponent>;

  beforeEach(waitForAsync(() => {
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
