import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLastRenewalComponent } from './asset-last-renewal.component';

describe('AssetLastRenewalComponent', () => {
  let component: AssetLastRenewalComponent;
  let fixture: ComponentFixture<AssetLastRenewalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetLastRenewalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetLastRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
