import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterFrameComponent } from './encounter-frame.component';

describe('EncounterFrameComponent', () => {
  let component: EncounterFrameComponent;
  let fixture: ComponentFixture<EncounterFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
