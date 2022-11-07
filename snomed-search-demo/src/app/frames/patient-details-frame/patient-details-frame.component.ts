import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-patient-details-frame',
  templateUrl: './patient-details-frame.component.html',
  styleUrls: ['./patient-details-frame.component.css']
})
export class PatientDetailsFrameComponent implements OnInit {



  @Input() snomedServer: string;

  displayedFamilyHistoryColumns : string[] = ['familyRelationship', 'familyProblem', 'familyAgeOnset', 'familyAgeDeath'];
  familyHistoryDataSource = new MatTableDataSource(this.demoModelService.getFamilyHistory());
  filteredFamilyProblemValues : SnomedConcept[] = [];
  filteredFamilyRelationshipValues : SnomedConcept[] = [];

  sexValues = [];
  genderValues = [];
  smokingStatusValues = [];
  smokerTypeValues = [];

  smokingStatus = false;

  sexChangeSubscription : Subscription;
  genderChangeSubscription : Subscription;
  smokingStatusChangeSubsciption: Subscription;
  familyProblemChangeSubscription: Subscription;
  familyRelationshipChangeSubscription: Subscription;

  patientDetailsForm = new FormGroup({
    sex: new FormControl(this.demoModelService.getSex()),
    gender: new FormControl(this.demoModelService.getGender()),
    smokingStatus: new FormControl(''),
    smokerType: new FormControl(''),
    familyRelationship: new FormControl(''),
    familyProblem: new FormControl(''),
    familyAgeOnset: new FormControl(''),
    familyAgeDeath: new FormControl('')
  });

  constructor(private httpClient: HttpClient, private demoModelService : DemoModelService) { 
  }

  ngOnInit() {

    const SEX_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('248153007 OR 248152002 OR 32570691000036108 OR 32570681000036106 OR 407377005 OR 407376001')
    + '&count=20&includeDesignations=true';

    const GENDER_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('248153007 OR 248152002 OR 32570691000036108 OR 32570681000036106 OR 407377005 OR 407376001')
    + '&count=20&includeDesignations=true';

    const SMOKING_STATUS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('266919005 OR 77176002 OR 8517006');

    const SMOKER_TYPE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('59978006 OR 65568007 OR 82302008');
   
    const FAMILY_RELATIONSHIPS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://aehrc.com/valueset/patient-relationships')
    + '&count=20&includeDesignations=true';

    const FAMILY_HISTORY_PROBLEM_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://healthterminologies.gov.au/fhir/ValueSet/clinical-condition-1') 
    + '&count=20&includeDesignations=true';

    // initialize the drop-downs with some data
    var sexSubscription = this.httpClient.get<ValueSet>(SEX_URL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.sexValues.push({value: val.code, display: val.display});
        })
        sexSubscription.unsubscribe();
      });

      var genderSubscription = this.httpClient.get<ValueSet>(GENDER_URL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.genderValues.push({value: val.code, display: val.display});
        })
        genderSubscription.unsubscribe();
      });

      var smokingStatusSubscription = this.httpClient.get<ValueSet>(SMOKING_STATUS_URL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.smokingStatusValues.push({value: val.code, display: val.display});
        })
        smokingStatusSubscription.unsubscribe();
      });

      var smokerTypeSubscription = this.httpClient.get<ValueSet>(SMOKER_TYPE_URL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.smokerTypeValues.push({value: val.code, display: val.display});
        })
        smokerTypeSubscription.unsubscribe();
      });

      this.smokingStatusChangeSubsciption = this.patientDetailsForm.get('smokingStatus').valueChanges
      .subscribe(data => {                  
        if (data.value === '77176002' ||
         data.value === '8517006') {
           this.smokingStatus = true;
        }
        else {
          this.smokingStatus = false;
        }
      });

      this.sexChangeSubscription = this.patientDetailsForm.get('sex').valueChanges
      .subscribe(sex => {
        this.demoModelService.setSex(sex)
      });

      this.genderChangeSubscription = this.patientDetailsForm.get('gender').valueChanges
      .subscribe(gender => {
        this.demoModelService.setGender(gender)
      });

      var familyProblemFilter;

      this.familyProblemChangeSubscription = this.patientDetailsForm.get('familyProblem').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          familyProblemFilter = (value instanceof Object) ? value.display : value;
        }),
        switchMap(value => this.httpClient.get<ValueSet>(FAMILY_HISTORY_PROBLEM_URL + '&filter=' + familyProblemFilter)
          .pipe(
            finalize(() => {
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredFamilyProblemValues = [];
  
        if (data.expansion.contains) {
  
          data.expansion.contains.forEach(val => {
            this.filteredFamilyProblemValues.push({value: val.code, display: val.display});
          });
        }
        else {
          this.filteredFamilyProblemValues.push({display: familyProblemFilter, value: null});
        }
      });

      var familyRelationshipFilter;

      this.familyRelationshipChangeSubscription = this.patientDetailsForm.get('familyRelationship').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          familyRelationshipFilter = (value instanceof Object) ? value.display : value;
        }),
        switchMap(value => this.httpClient.get<ValueSet>(FAMILY_RELATIONSHIPS_URL + '&filter=' + familyRelationshipFilter)
          .pipe(
            finalize(() => {
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredFamilyRelationshipValues = [];
  
        if (data.expansion.contains) {
  
          data.expansion.contains.forEach(val => {
            this.filteredFamilyRelationshipValues.push({value: val.code, display: val.display});
          });
        }
        else {
          this.filteredFamilyRelationshipValues.push({display: familyRelationshipFilter, value: null});
        }
      });
  
  }

  onNgDestroy() {
    this.sexChangeSubscription.unsubscribe();
    this.genderChangeSubscription.unsubscribe();
    this.smokingStatusChangeSubsciption.unsubscribe();
    this.familyProblemChangeSubscription.unsubscribe();
    this.familyRelationshipChangeSubscription.unsubscribe();
  }

  onSaveFamilyHistory() {

    this.demoModelService.addFamilyHistory(
      this.patientDetailsForm.get('familyRelationship').value ? this.patientDetailsForm.get('familyRelationship').value.value : null,
      this.patientDetailsForm.get('familyRelationship').value ? this.patientDetailsForm.get('familyRelationship').value.display : null,
      this.patientDetailsForm.get('familyProblem').value ? this.patientDetailsForm.get('familyProblem').value.value : null,
      this.patientDetailsForm.get('familyProblem').value ? this.patientDetailsForm.get('familyProblem').value.display : null,
      this.patientDetailsForm.get('familyAgeOnset').value ? this.patientDetailsForm.get('familyAgeOnset').value : null,
      this.patientDetailsForm.get('familyAgeDeath').value ? this.patientDetailsForm.get('familyAgeDeath').value : null
    );

    // cause table refresh
    this.familyHistoryDataSource = new MatTableDataSource(this.demoModelService.getFamilyHistory());
    
    // empty fields for another family history problem to be added
    this.patientDetailsForm.get('familyRelationship').reset();
    this.patientDetailsForm.get('familyProblem').reset();
    this.patientDetailsForm.get('familyAgeOnset').reset();
    this.patientDetailsForm.get('familyAgeDeath').reset();

    this.filteredFamilyRelationshipValues = [];
    this.filteredFamilyProblemValues = [];

  }

  compare(value1: any, value2: any): boolean {

    var equal = false;
    if (value1 && value2) {
      if (value1.value === value2.value) {
        equal = true;
      }
    }
    return equal;
  }

  displayFn(code) {
    if (!code) return '';
    return code.display;
  }

  isMatBadgeHidden(conceptID) {
    if (conceptID) {
      return false;
    }
    return true;
  }

}
