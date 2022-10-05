import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CreateEditKycComponent } from './create-edit-kyc.component';

describe('CreateEditKycComponent', () => {
  let component: CreateEditKycComponent;
  let fixture: ComponentFixture<CreateEditKycComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
