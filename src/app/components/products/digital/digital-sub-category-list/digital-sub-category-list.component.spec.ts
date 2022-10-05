import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DigitalSubCategoryListComponent } from './digital-sub-category-list.component';

describe('DigitalSubCategoryListComponent', () => {
  let component: DigitalSubCategoryListComponent;
  let fixture: ComponentFixture<DigitalSubCategoryListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSubCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSubCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
