import { TestBed } from '@angular/core/testing';

import { DemoModelService } from './demo-model.service';

describe('DemoModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemoModelService = TestBed.get(DemoModelService);
    expect(service).toBeTruthy();
  });
});
