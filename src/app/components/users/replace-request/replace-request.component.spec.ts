import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ReplaceRequestComponent } from './replace-request.component';

describe('ReplaceRequestComponent', () => {
  let component: ReplaceRequestComponent;
  let fixture: ComponentFixture<ReplaceRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
