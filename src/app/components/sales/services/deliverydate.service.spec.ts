import { TestBed } from '@angular/core/testing';

import { DeliverydateService } from './deliverydate.service';

describe('DeliverydateService', () => {
  let service: DeliverydateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliverydateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
