import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { ValueSet, CodeSystem} from 'fhir-stu3';
import { DemoModelService, Reaction, Problem, Vaccination, Investigation, Procedure, Medication } from 'src/app/demo-model.service';



@Component({
  selector: 'app-patient-summary-frame',
  templateUrl: './patient-summary-frame.component.html',
  styleUrls: ['./patient-summary-frame.component.css']
})
export class PatientSummaryFrameComponent implements OnInit {

  @Input() snomedServer: string;
  
  // allergies / adverse reactions
  // reactionData: Reaction[] = [
  //   {substance: '764146007', criticality: '75540009', manifestations: '271807003', verificationStatus: 'confirmed', comment: 'childhood'},
  // ];
  displayedReactionColumns : string[] = ['substanceDisplay', 'criticalityDisplay', 'manifestationDisplay', 'verificationStatus', 'comment'];
  reactionDataSource = this.demoModelService.getReactions(undefined);

  // medication
  medicationData: Medication[] = [
    {name: 'ventolin', strength: '100 microgram', form: 'inhaler', route: 'oral', freq: 'twice daily', duration: 'ongoing', instruction: 'as required', clinicalIndication: 'asthma', comment: ''},
  ];
  displayedMedicationColumns: string[] = ['name', 'strength', 'form', 'route', 'freq', 'duration', 'instruction', 'clinicalIndication', 'comment'];
  medicationDataSource = this.medicationData;

  // problems
  // problemData: Problem[] = [
  //   {name: 'asthma', date: '1990-08-08'},
  // ];
  displayedProblemColumns: string[] = ['codeDisplay', 'date'];
  problemDataSource = this.demoModelService.getProblems();  

  // vaccinations
  vaccinationData: Vaccination[] = [
    {name: 'HEP-B', brandName: '', substance: '', date: '2019-08-21'},
  ];
  displayedVaccinationColumns: string[] = ['name', 'brandName', 'substance', 'date'];
  vaccinationDataSource = this.vaccinationData;

  // investigations
  investigationData: Investigation[] = [
    {test: 'Cholesterol', date: '2019-08-22', result: '20'}
  ];
  displayedInvestigationColumns: string[] = ['test', 'date', 'result'];
  investigationDataSource = this.investigationData;

  // procedures
  // procedureData: Procedure[] = [
  //   {name: 'Appendectomy', date: '2010-06-04'}
  // ];
  displayedProcedureColumns: string[] = ['codeDisplay', 'date'];
  procedureDataSource = this.demoModelService.getProcedures();//this.procedureData;


  snomedConceptCache = {};

  constructor(private httpClient: HttpClient, private demoModelService: DemoModelService) { 
  }

  ngOnInit() {
    console.log("procedureDataSource=", this.procedureDataSource);
  }

  getProcedures(): void {
    this.demoModelService.getProcedures();
  }

  lookupSnomedDesc(code : string) {

    var description = "";

    if (code) {
      console.log("looking up description for =", code);
      description = this.snomedConceptCache[code];
  //console.log("description", description);
      if (!description) {
        //console.log("nothing found in cache for '" + code + '"');
        //console.log("cache is ", this.snomedConceptCache);
        //console.log("keys=" + Object.keys(this.snomedConceptCache));
        // cache miss, lookup server
        var lookupSubscription = this.httpClient.get<CodeSystem>(this.snomedServer + '/CodeSystem/$lookup?system=http://snomed.info/sct&code=' + code)
          .subscribe(result => {
            //console.log("result=", result);
            for (let entry of result['parameter']) {
              if (entry['name'] === 'display') {
                //console.log("RESULT! entry['valueString']", entry['valueString']);
                this.snomedConceptCache[code] = entry['valueString'];
                //console.log("this.snomedConceptCache", this.snomedConceptCache);
                break;
              }
            }
            if (!(code in this.snomedConceptCache)) {
              this.snomedConceptCache[code] = "unknown";
            }
            lookupSubscription.unsubscribe();
            return this.snomedConceptCache[code];
          });
          return lookupSubscription;
      }

    }
    return description;

  }

}
