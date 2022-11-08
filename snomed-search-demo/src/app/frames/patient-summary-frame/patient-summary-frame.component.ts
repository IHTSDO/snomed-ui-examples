import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DemoModelService, Vaccination, PathologyInvestigation, Medication } from 'src/app/demo-model.service';

@Component({
  selector: 'app-patient-summary-frame',
  templateUrl: './patient-summary-frame.component.html',
  styleUrls: ['./patient-summary-frame.component.css']
})
export class PatientSummaryFrameComponent implements OnInit {

  @Input() snomedServer: string;
  
  displayedReactionColumns : string[] = ['substanceDisplay', 'criticalityDisplay', 'manifestationDisplay', 'verificationStatus', 'comment'];
  reactionDataSource = this.demoModelService.getReactions(undefined);

  // medication
  medicationData: Medication[] = [
    {name: 'ventolin', strength: '100 microgram', form: 'inhaler', route: 'oral', freq: 'twice daily', duration: 'ongoing', instruction: 'as required', clinicalIndication: 'asthma', comment: ''},
  ];
  displayedMedicationColumns: string[] = ['name', 'strength', 'form', 'route', 'freq', 'duration', 'instruction', 'clinicalIndication', 'comment'];
  medicationDataSource = this.medicationData;


  displayedProblemColumns: string[] = ['codeDisplay', 'date'];
  problemDataSource = this.demoModelService.getProblems();  

  // vaccinations
  vaccinationData: Vaccination[] = [
    {name: 'HEP-B', brandName: '', substance: '', date: '2019-08-21'},
  ];
  displayedVaccinationColumns: string[] = ['name', 'brandName', 'substance', 'date'];
  vaccinationDataSource = this.vaccinationData;

  // pathology
  pathologyInvestigationData: PathologyInvestigation[] = [
    {test: 'Cholesterol', date: '2019-08-22', result: '20'}
  ];
  displayedPathologyInvestigationColumns: string[] = ['test', 'date', 'result'];
  pathologyInvestigationDataSource = this.pathologyInvestigationData;

  displayedProcedureColumns: string[] = ['codeDisplay', 'date'];
  procedureDataSource = this.demoModelService.getProcedures();


  snomedConceptCache = {};

  constructor(private demoModelService: DemoModelService) { 
  }

  ngOnInit() {
  }

  isMatBadgeHidden(conceptID) {
    if (conceptID) {
      return false;
    }
    return true;
  }

}
