import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { KycDetailsComponent } from './kyc-details.component';

describe('KycDetailsComponent', () => {
  let component: KycDetailsComponent;
  let fixture: ComponentFixture<KycDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
