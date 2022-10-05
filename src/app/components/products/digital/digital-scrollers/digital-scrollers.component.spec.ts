import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DigitalScrollersComponent } from './digital-scrollers.component';

describe('DigitalScrollersComponent', () => {
  let component: DigitalScrollersComponent;
  let fixture: ComponentFixture<DigitalScrollersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalScrollersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalScrollersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
