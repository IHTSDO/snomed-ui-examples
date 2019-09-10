import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsFrameComponent } from './patient-details-frame.component';

describe('PatientDetailsFrameComponent', () => {
  let component: PatientDetailsFrameComponent;
  let fixture: ComponentFixture<PatientDetailsFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDetailsFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailsFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
