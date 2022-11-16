import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService} from 'src/app/demo-model.service';
import { Subscription} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-encounter-frame',
  templateUrl: './encounter-frame.component.html',
  styleUrls: ['./encounter-frame.component.css']
})
export class EncounterFrameComponent implements OnInit {

  @Input() snomedServer: string;

  displayedEncounterColumns : string[] = ['reasonForEncounterDisplay', 'diagnosisDisplay', 'diagnosisNote', 'procedureDisplay', 'lateralityDisplay', 'encounterNote'];
  encounterDataSource = new MatTableDataSource(this.demoModelService.getEncounters());

  timestamp : Date;
  
  filteredEncounterReasonValues = [];
  filteredProcedureValues = [];
  lateralityValues = [];
  filteredDiagnosisValues = [];

  encounterForm = new FormGroup({
    reasonForEncounter: new FormControl(''),
    procedure: new FormControl(''),
    diagnosis: new FormControl(''),
    diagnosisNote: new FormControl(''),
    laterality: new FormControl({value: '', disabled: true}),
    encounterNote: new FormControl(''),
    boosted: new FormControl(false),
  });

  preferredDiagnosisValues = [
    {value: '38341003', display:	'Hypertension'},
    {value: '195967001', display:	'Asthma'},
    {value: '35489007', display:	'Depression'},
    {value: '48694002', display:	'Anxiety'},
    {value: '73211009', display:	'Diabetes mellitus'},
    {value: '46635009', display:	'Type 1 diabetes mellitus'},
    {value: '44054006', display:	'Type 2 diabetes mellitus'},
    {value: '64859006', display:	'Osteoporosis'},
    {value: '49436004', display:	'Atrial fibrillation'},
    {value: '13645005', display:	'COPD'},
    {value: '414545008', display:	'Ischaemic heart disease'},
    {value: '42343007', display:	'Congestive heart failure'},
    {value: '230690007', display:	'Stroke'},
    {value: '13644009', display:	'Hypercholesterolaemia'},
    {value: '65323003', display:	'Polymyalgia rheumatica'},
    {value: '85898001', display:	'Cardiomyopathy'},
    {value: '371125006', display:	'Labile essential hypertension'},
    {value: '70995007', display:	'Pulmonary hypertension'},
    {value: '59621000', display:	'Essential hypertension'},
    {value: '233873004', display:	'Hypertrophic cardiomyopathy'},
    {value: '11687002', display:	'Gestational diabetes mellitus'},
    {value: '66931009', display:	'Hypercalcaemia'},
    {value: '14140009', display:	'Hyperkalaemia'},
    {value: '34486009', display:	'Hyperthyroidism'},
    {value: '45007003', display:	'Hypotension'},
    {value: '89627008', display:	'Hyponatraemia'},
    {value: '5291005', display:	'Hypocalcaemia'},
    {value: '40930008', display:	'Hypothyroidism'}
  ];

  encounterReasonChangeSubscription : Subscription;
  diagnosisChangeSubscription : Subscription;
  procedureChangeSubscription: Subscription;

  constructor(private httpClient: HttpClient, private demoModelService: DemoModelService) { 
  }

  ngOnInit() {

    this.timestamp = new Date();

    const ENCOUNTER_REASON_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://aehrc.com/valueset/reason-for-encounter') 
    + '&count=20&includeDesignations=true';
    // SI Version
    // const ENCOUNTER_REASON_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 404684003 OR < 71388002 OR < 243796009 OR < 272379006')
    // + '&count=20&includeDesignations=true';

    const DIAGNOSIS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://healthterminologies.gov.au/fhir/ValueSet/clinical-condition-1') 
    + '&count=20&includeDesignations=true';
    // SI Version
    // const DIAGNOSIS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 404684003')
    // + '&count=20&includeDesignations=true';

    // should be a value set
    const PREFERRED_DIAGNOSIS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('38341003 OR 195967001 OR 35489007 OR 48694002 OR ' +
    '73211009 OR 46635009 OR 44054006 OR 64859006 OR 49436004 OR 13645005 OR 414545008 OR 42343007 OR 230690007 OR ' +
    '13644009 OR 65323003 OR 85898001 OR 371125006 OR 70995007 OR 59621000 OR 233873004 OR 11687002 OR 66931009 OR ' +
    '14140009 OR 34486009 OR 45007003 OR 89627008 OR 5291005 OR 40930008') + '&includeDesignations=true'

    const PROCEDURE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://healthterminologies.gov.au/fhir/ValueSet/procedure-1') 
    + '&count=20&includeDesignations=true';
    // SI Version
    // const PROCEDURE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 71388002')
    // + '&count=20&includeDesignations=true';

    const LATERALITY_URL = 	this.snomedServer + '/ValueSet/$expand?_format=json&url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 182353008') 
    + '&includeDesignations=true';

    var encounterReasonFilter;
    this.encounterReasonChangeSubscription = this.encounterForm.get('reasonForEncounter').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        encounterReasonFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(ENCOUNTER_REASON_URL + '&filter=' + encounterReasonFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredEncounterReasonValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredEncounterReasonValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredEncounterReasonValues.push({display: encounterReasonFilter, value: null});
      }       
    });

    var diagnosisFilter;

    this.diagnosisChangeSubscription = this.encounterForm.get('diagnosis').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        diagnosisFilter = (value instanceof Object) ? value.display : value;

        // boost search
        if (this.encounterForm.get('boosted').value) {
          this.preferredDiagnosisValues.filter(function(preferredVal) {
            return (preferredVal['display']).indexOf(value) > -1;
          }).forEach(val => {
            this.filteredDiagnosisValues.push(val);
          })
        }
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + diagnosisFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredDiagnosisValues = [];

      // boost search
      if (this.encounterForm.get('boosted').value) {
        this.preferredDiagnosisValues.filter(function(preferredVal) {
          return (preferredVal['display']).toLowerCase().indexOf(diagnosisFilter.toLowerCase()) > -1;
        }).forEach(val => {
          this.filteredDiagnosisValues.push(val);
        })
      }

      if (data.expansion.contains) {

        data.expansion.contains.forEach(val => {
          this.filteredDiagnosisValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredDiagnosisValues.push({display: diagnosisFilter, value: null});
      }
    });

    var procedureFilter;
    this.procedureChangeSubscription = this.encounterForm.get('procedure').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        procedureFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(PROCEDURE_URL + '&filter=' + procedureFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredProcedureValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredProcedureValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredProcedureValues.push({display: procedureFilter, value: null});
      }
    });

    var lateralitySubscription = this.httpClient.get<ValueSet>(LATERALITY_URL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.lateralityValues.push({value: val.code, display: val.display});
        })
        this.lateralityValues.push({value: '', display: ''});
        lateralitySubscription.unsubscribe();
      }
    );

  }

  onNgDestroy() {
    this.encounterReasonChangeSubscription.unsubscribe();
    this.diagnosisChangeSubscription.unsubscribe();
    this.procedureChangeSubscription.unsubscribe();
  }

  displayFn(code) {
    if (!code) return '';
    return code.display;
  }

  procedureSelected(procedure) {
    
    // extract procedure site from the selected procedure

    var bodySiteSubscription = this.httpClient.get<ValueSet>(this.snomedServer + '/ValueSet/$expand?_format=json&url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent(procedure.value + '.<< 363704007'))
     .subscribe(data => {

        if (data.expansion.contains) {

          var bodySiteCode = data.expansion.contains[0].code;

          // extract the laterality if it exists and populate laterality field
          var queryLatSubscription = this.httpClient.get<ValueSet>(this.snomedServer + '/ValueSet/$expand?_format=json&url=' + encodeURIComponent('http://snomed.info/sct') 
          + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent(procedure.value + '.<< 363704007.272741003'))
           .subscribe(data => {
            if (data.expansion.contains) {
              this.encounterForm.get('laterality').disable();
              if (data.expansion.contains.length > 1) {
                // left and right
                this.encounterForm.get('laterality').setValue({value: '51440002', display: 'Right and left'});
              }
              else {
                var latDetails = data.expansion.contains[0];
                this.encounterForm.get('laterality').setValue({value: latDetails['code'], display: latDetails['display']});
                }
            }
            else {

              // Snowstorm returns this error 
              // "Invalid request: The FHIR endpoint on this server does not know how to handle GET operation[ValueSet/$validate-code] with parameters [[code, system, url]]"
              // keeping in case it gets enabled in the future
              //
              // now check the lateralizable reference set to see if it is permissable to set the laterality of this concept
              // var lateralizableSubscription = this.httpClient.get(this.snomedServer + '/ValueSet/$validate-code?system=http://snomed.info/sct'
              // + '&code=' + bodySiteCode + '&url=http://snomed.info/sct?fhir_vs=refset/723264001')
              // .subscribe(data => {
              //   if (data['parameter'][0].valueBoolean) {
              //     + '&code=' + bodySiteCode + '&url=http://snomed.info/sct?fhir_vs=refset/723264001');
              //     this.encounterForm.get('laterality').enable();
              //   }
              //   else {
              //     this.encounterForm.get('laterality').disable();
              //   }
              //   lateralizableSubscription.unsubscribe();
              // });

              // now check the lateralizable reference set to see if it is permissable to set the laterality of this concept
              var lateralizableSubscription = this.httpClient.get(this.snomedServer + '/ValueSet/$expand?_format=json&url=' + encodeURIComponent('http://snomed.info/sct') 
              + encodeURIComponent('?fhir_vs=ecl/(') + encodeURIComponent(procedure.value + '.<< 363704007) AND ^723264001'))
              .subscribe(data => {
                if (data['expansion']['contains'] && data['expansion']['contains'].length > 0) {
                  this.encounterForm.get('laterality').enable();
                }
                else {
                  this.encounterForm.get('laterality').disable();
                }
               lateralizableSubscription.unsubscribe();
              });

              // reset the laterality to blank in case a procedure was previously selected
              this.encounterForm.get('laterality').setValue(null);
            }
            queryLatSubscription.unsubscribe();
           });

        }
        else {
          // no procedure site, don't allow laterality to be specified
          // reset to laterality to blank in case a procedure was previously selected
          this.encounterForm.get('laterality').setValue(null);
          this.encounterForm.get('laterality').disable();
        }
      
      bodySiteSubscription.unsubscribe();

    });
  }

  compareLaterality(laterality1: any, laterality2: any): boolean {
    var equal = false;
    if (laterality1 && laterality2) {
      if (laterality1.value === laterality2.value) {
        equal = true;
      }
    }
    return equal;
  }

  boostChecked() {
    // reset so old values don't show up
    this.filteredDiagnosisValues = [];
  }

  onSaveEncounter() {

    if (this.encounterForm.get('procedure').value) {
      this.demoModelService.addProcedure(
        this.encounterForm.get('procedure').value.value,
        this.encounterForm.get('procedure').value.display,
        this.timestamp.toString());
    }
    if (this.encounterForm.get('diagnosis').value) {
      this.demoModelService.addProblem(
        this.encounterForm.get('diagnosis').value.value,
        this.encounterForm.get('diagnosis').value.display,
        this.timestamp.toString());
    }

    this.demoModelService.addEncounter(
      this.encounterForm.get('reasonForEncounter').value ? this.encounterForm.get('reasonForEncounter').value.value : null,
      this.encounterForm.get('reasonForEncounter').value ? this.encounterForm.get('reasonForEncounter').value.display : null,
      this.encounterForm.get('procedure').value ? this.encounterForm.get('procedure').value.value : null,
      this.encounterForm.get('procedure').value ? this.encounterForm.get('procedure').value.display : null,
      this.encounterForm.get('diagnosis').value ? this.encounterForm.get('diagnosis').value.value : null,
      this.encounterForm.get('diagnosis').value ? this.encounterForm.get('diagnosis').value.display : null,
      this.encounterForm.get('diagnosisNote').value,
      this.encounterForm.get('laterality').value ? this.encounterForm.get('laterality').value.value : null,
      this.encounterForm.get('laterality').value ? this.encounterForm.get('laterality').value.display : null, 
      this.encounterForm.get('encounterNote').value,
    );

    // cause table refresh
    this.encounterDataSource = new MatTableDataSource(this.demoModelService.getEncounters());

    // empty fields for another encounter to be added
    this.encounterForm.reset({ emitEvent: false });

    this.filteredDiagnosisValues = [];
    this.filteredEncounterReasonValues = [];
    this.filteredProcedureValues = [];

  }

  isMatBadgeHidden(conceptID) {
    if (conceptID) {
      return false;
    }
    return true;
  }

}
