import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsFrameComponent as PatientSummaryFrameComponent } from './patient-summary-frame.component';

describe('PatientDetailsFrameComponent', () => {
  let component: PatientSummaryFrameComponent;
  let fixture: ComponentFixture<PatientSummaryFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSummaryFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSummaryFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
