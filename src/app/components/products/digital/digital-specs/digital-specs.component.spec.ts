import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DigitalSpecsComponent } from './digital-specs.component';

describe('DigitalSpecsComponent', () => {
  let component: DigitalSpecsComponent;
  let fixture: ComponentFixture<DigitalSpecsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSpecsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
