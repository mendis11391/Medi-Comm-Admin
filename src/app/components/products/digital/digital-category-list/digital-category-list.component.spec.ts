import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalCategoryListComponent } from './digital-category-list.component';

describe('DigitalCategoryListComponent', () => {
  let component: DigitalCategoryListComponent;
  let fixture: ComponentFixture<DigitalCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
