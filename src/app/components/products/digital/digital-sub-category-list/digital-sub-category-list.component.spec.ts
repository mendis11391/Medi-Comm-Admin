import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSubCategoryListComponent } from './digital-sub-category-list.component';

describe('DigitalSubCategoryListComponent', () => {
  let component: DigitalSubCategoryListComponent;
  let fixture: ComponentFixture<DigitalSubCategoryListComponent>;

  beforeEach(async(() => {
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
