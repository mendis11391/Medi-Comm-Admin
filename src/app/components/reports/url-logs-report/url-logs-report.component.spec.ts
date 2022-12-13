import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlLogsReportComponent } from './url-logs-report.component';

describe('UrlLogsReportComponent', () => {
  let component: UrlLogsReportComponent;
  let fixture: ComponentFixture<UrlLogsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlLogsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlLogsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
