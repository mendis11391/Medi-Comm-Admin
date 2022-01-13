import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalScrollersComponent } from './digital-scrollers.component';

describe('DigitalScrollersComponent', () => {
  let component: DigitalScrollersComponent;
  let fixture: ComponentFixture<DigitalScrollersComponent>;

  beforeEach(async(() => {
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
