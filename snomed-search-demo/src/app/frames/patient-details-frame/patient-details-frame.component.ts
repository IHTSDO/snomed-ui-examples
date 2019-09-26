import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-details-frame',
  templateUrl: './patient-details-frame.component.html',
  styleUrls: ['./patient-details-frame.component.css']
})
export class PatientDetailsFrameComponent implements OnInit {

  @Input() snomedServer: string;

  sexValues = [];
  smokingStatusValues = [];
  smokerTypeValues = [];

  smokingStatus = false;

  sexChangeSubscription : Subscription;
  smokingStatusChangeSubsciption: Subscription;

  patientDetailsForm = new FormGroup({
    sex: new FormControl(this.demoModelService.getSex()),
    smokingStatus: new FormControl(''),
    smokerType: new FormControl(''),
  });

  constructor(private httpClient: HttpClient, private demoModelService : DemoModelService) { 
  }

  ngOnInit() {

    const SEX_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('248153007 OR 248152002 OR 32570691000036108 OR 32570681000036106 OR 407377005 OR 407376001')
    + '&count=20&includeDesignations=true';

    const SMOKING_STATUS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('266919005 OR 77176002 OR 8517006');

    const SMOKER_TYPE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('59978006 OR 65568007 OR 82302008');
   
    // initialize the drop-downs with some data
    var sexSubscription = this.httpClient.get<ValueSet>(SEX_URL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.sexValues.push({value: val.code, display: val.display});
        })
        sexSubscription.unsubscribe();
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
  }

  onNgDestroy() {
    this.sexChangeSubscription.unsubscribe();
    this.smokingStatusChangeSubsciption.unsubscribe();
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

}
