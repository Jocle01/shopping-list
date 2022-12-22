import { TestBed } from '@angular/core/testing';

import { LitsItemHandlerService } from './lits-item-handler.service';

describe('LitsItemHandlerService', () => {
  let service: LitsItemHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitsItemHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
