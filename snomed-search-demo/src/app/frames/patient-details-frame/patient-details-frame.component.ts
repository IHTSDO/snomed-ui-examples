import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { ValueSet } from 'fhir-stu3';

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

  //status = {display:'Male',value:'248153007'};

  patientDetailsForm = new FormGroup({
    sex: new FormControl({display:'Male',value:'248153007'}),
    smokingStatus: new FormControl(''),
    smokerType: new FormControl(''),
  });

  compareSex(sex1: any, sex2: any): boolean {
    console.log("comparing sex1", sex1);
    console.log("comparing sex2", sex2);
    var equal = false;
    if (sex1 && sex2) {
      if (sex1.value === sex2.value) {
        equal = true;
      }
    }
    return equal;
  }

  constructor(private httpClient: HttpClient) { 
  }

  ngOnInit() {

  //   this.patientDetailsForm.controls.sex.setValue(
  //     {sex:'Male'}
  //  );

    // this.patientDetailsForm.get('sex').valueChanges.subscribe(val => {
    //   console.log('My sex is ', val);
    // });

    //<!--[selected]="sex.code === '248153007'"-->
    //this.patientDetailsForm.get('sex').setValue('Male');

    //const SEX_URL = this.snomedServer + '/ValueSet/$expand?_format=json&url=http:%2F%2Fsnomed.info%2Fsct?fhir_vs=isa%2F429019009';
    const SEX_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('248153007 OR 248152002 OR 32570691000036108 OR 32570681000036106 OR 407377005 OR 407376001')
    + '&count=20&includeDesignations=true';

    const SMOKING_STATUS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('266919005 OR 77176002 OR 8517006');

    const SMOKER_TYPE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('59978006 OR 65568007 OR 82302008');
    console.log("smoker type url =", SMOKER_TYPE_URL);
   
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

      var smokingStatusSubsciption = this.patientDetailsForm.get('smokingStatus').valueChanges
      .subscribe(data => {
        console.log('smoking staus=', this.patientDetailsForm.get('smokingStatus').value);
        if (this.patientDetailsForm.get('smokingStatus').value.code === '77176002' ||
         this.patientDetailsForm.get('smokingStatus').value.code === '8517006') {
           this.smokingStatus = true;
        }
        else {
          this.smokingStatus = false;
        }
        console.log("smokingStatus is now ", this.smokingStatus);
      });
  }

  // isSmoker() {
  //   //77176002|Smoker| OR 8517006|Ex-smoker|)
  //   var isSmoker = false;
    
  //   if (this.patientDetailsForm.get('smokingStatus').value.code === '77176002' ||
  //   this.patientDetailsForm.get('smokingStatus').value.code === '8517006') {
  //     isSmoker = true;
  //   }
  //   console.log("isSmoker=", isSmoker);
  //   return isSmoker;
  // }

}
