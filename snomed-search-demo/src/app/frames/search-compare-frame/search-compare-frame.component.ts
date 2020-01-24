import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-search-compare-frame',
  templateUrl: './search-compare-frame.component.html',
  styleUrls: ['./search-compare-frame.component.css']
})
export class SearchCompareFrameComponent implements OnInit {

  @Input() snomedServer: string;

  filteredGoodDiagnosis0Values : SnomedConcept[] = [];
  goodDiagnosis0Values: string[] = [];
  filteredBadDiagnosis0Values : SnomedConcept[] = [];
  badDiagnosis0Values: string[] = [];
  
  filteredGoodDiagnosis1Values : SnomedConcept[] = [];
  goodDiagnosis1Values: string[] = [];
  filteredBadDiagnosis1Values : SnomedConcept[] = [];
  badDiagnosis1Values: string[] = [];

  filteredGoodDiagnosis2Values : SnomedConcept[] = [];
  goodDiagnosis2Values: string[] = [];
  filteredBadDiagnosis2Values : SnomedConcept[] = [];
  badDiagnosis2Values: string[] = [];  

  filteredGoodDiagnosis3Values : SnomedConcept[] = [];
  goodDiagnosis3Values: string[] = [];
  filteredBadDiagnosis3Values : SnomedConcept[] = [];
  badDiagnosis3Values: string[] = [];  

  filteredGoodDiagnosis4Values : SnomedConcept[] = [];
  goodDiagnosis4Values: string[] = [];
  filteredBadDiagnosis4Values : SnomedConcept[] = [];
  badDiagnosis4Values: string[] = [];  
  
  searchComparisonForm = new FormGroup({
    goodDiagnosis0: new FormControl(''),
    badDiagnosis0: new FormControl(''),
    goodDiagnosis1: new FormControl(''),
    badDiagnosis1: new FormControl(''),
    goodDiagnosis2: new FormControl(''),
    badDiagnosis2: new FormControl(''),
    goodDiagnosis3: new FormControl(''),
    badDiagnosis3: new FormControl(''),
    goodDiagnosis4: new FormControl(''),
    badDiagnosis4: new FormControl('')
  });

  goodDiagnosis0ChangeSubsciption : Subscription;
  badDiagnosis0ChangeSubsciption : Subscription; 
  goodDiagnosis1ChangeSubsciption : Subscription;
  badDiagnosis1ChangeSubsciption : Subscription; 
  goodDiagnosis2ChangeSubsciption : Subscription;
  badDiagnosis2ChangeSubsciption : Subscription; 
  goodDiagnosis3ChangeSubsciption : Subscription;
  badDiagnosis3ChangeSubsciption : Subscription; 
  goodDiagnosis4ChangeSubsciption : Subscription;
  badDiagnosis4ChangeSubsciption : Subscription; 

  constructor(private httpClient: HttpClient, private demoModelService: DemoModelService) { 
  }

  ngOnInit(): void {

    const DIAGNOSIS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://healthterminologies.gov.au/fhir/ValueSet/clinical-condition-1') 
    + '&count=20&includeDesignations=true';

    const ALL_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct')
    + encodeURIComponent('?fhir_vs=isa/138875005') + '&count=20&includeDesignations=true';

    var goodDiagnosis0Filter;
    this.goodDiagnosis0ChangeSubsciption = this.searchComparisonForm.get('goodDiagnosis0').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        goodDiagnosis0Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + goodDiagnosis0Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredGoodDiagnosis0Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredGoodDiagnosis0Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredGoodDiagnosis0Values.push({display: goodDiagnosis0Filter, value: null});        
      }

    });

    var badDiagnosis0Filter;
    this.badDiagnosis0ChangeSubsciption = this.searchComparisonForm.get('badDiagnosis0').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        badDiagnosis0Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + badDiagnosis0Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredBadDiagnosis0Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          val.designation.forEach(designation => {
            this.filteredBadDiagnosis0Values.push({value: val.code, display: designation.value});
          })
        });
      }
      else {
        this.filteredBadDiagnosis0Values.push({display: badDiagnosis0Filter, value: null});        
      }


    });


    var goodDiagnosis1Filter;
    this.goodDiagnosis1ChangeSubsciption = this.searchComparisonForm.get('goodDiagnosis1').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        goodDiagnosis1Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + goodDiagnosis1Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredGoodDiagnosis1Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredGoodDiagnosis1Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredGoodDiagnosis1Values.push({display: goodDiagnosis1Filter, value: null});        
      }

    });

    var badDiagnosis1Filter;
    this.badDiagnosis1ChangeSubsciption = this.searchComparisonForm.get('badDiagnosis1').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        badDiagnosis1Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + badDiagnosis1Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredBadDiagnosis1Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredBadDiagnosis1Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredBadDiagnosis1Values.push({display: badDiagnosis1Filter, value: null});        
      }
      this.filteredBadDiagnosis1Values.sort((a, b) => a.display.localeCompare(b.display));

    });

    var goodDiagnosis2Filter;
    this.goodDiagnosis2ChangeSubsciption = this.searchComparisonForm.get('goodDiagnosis2').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        goodDiagnosis2Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + goodDiagnosis2Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredGoodDiagnosis2Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredGoodDiagnosis2Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredGoodDiagnosis2Values.push({display: goodDiagnosis2Filter, value: null});        
      }

    });

    var badDiagnosis2Filter;
    this.badDiagnosis2ChangeSubsciption = this.searchComparisonForm.get('badDiagnosis2').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        badDiagnosis2Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(ALL_URL + '&filter=' + badDiagnosis2Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredBadDiagnosis2Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredBadDiagnosis2Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredBadDiagnosis2Values.push({display: badDiagnosis2Filter, value: null});        
      }

    });

    var goodDiagnosis3Filter;
    this.goodDiagnosis3ChangeSubsciption = this.searchComparisonForm.get('goodDiagnosis3').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        goodDiagnosis3Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + goodDiagnosis3Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredGoodDiagnosis3Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredGoodDiagnosis3Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredGoodDiagnosis3Values.push({display: goodDiagnosis3Filter, value: null});        
      }

    });

    var badDiagnosis3Filter;
    this.badDiagnosis3ChangeSubsciption = this.searchComparisonForm.get('badDiagnosis3').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        badDiagnosis3Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(ALL_URL + '&filter=' + badDiagnosis3Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredBadDiagnosis3Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredBadDiagnosis3Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredBadDiagnosis3Values.push({display: badDiagnosis3Filter, value: null});        
      }

    });

    var goodDiagnosis4Filter;
    this.goodDiagnosis4ChangeSubsciption = this.searchComparisonForm.get('goodDiagnosis4').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        goodDiagnosis4Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(DIAGNOSIS_URL + '&filter=' + goodDiagnosis4Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredGoodDiagnosis4Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredGoodDiagnosis4Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredGoodDiagnosis4Values.push({display: goodDiagnosis4Filter, value: null});        
      }

    });

    var badDiagnosis4Filter;
    this.badDiagnosis4ChangeSubsciption = this.searchComparisonForm.get('badDiagnosis4').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        badDiagnosis4Filter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(ALL_URL + '&filter=' + badDiagnosis4Filter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredBadDiagnosis4Values = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredBadDiagnosis4Values.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredBadDiagnosis4Values.push({display: badDiagnosis4Filter, value: null});        
      }
      this.filteredBadDiagnosis4Values.sort((a, b) => a.display.localeCompare(b.display));

    });


  }

  ngOnDestroy() {
    this.goodDiagnosis1ChangeSubsciption.unsubscribe();
    this.badDiagnosis1ChangeSubsciption.unsubscribe();
    this.goodDiagnosis2ChangeSubsciption.unsubscribe();
    this.badDiagnosis2ChangeSubsciption.unsubscribe();
    this.goodDiagnosis3ChangeSubsciption.unsubscribe();
    this.badDiagnosis3ChangeSubsciption.unsubscribe();
    this.goodDiagnosis4ChangeSubsciption.unsubscribe();
    this.badDiagnosis4ChangeSubsciption.unsubscribe();
  }

  displayFn(code) {
    if (!code) return '';
    return code.display;
  }

  @ViewChild('myAutocompleteTrigger3', {static:true}) private _myAutocompleteTrigger3: MatAutocompleteTrigger;
  @ViewChild('myAutocompleteTrigger4', {static:true}) private _myAutocompleteTrigger4: MatAutocompleteTrigger;

  on3Enter() {
    this.autoCompleteDisabled3 = false;
    this._myAutocompleteTrigger3.openPanel();
  }

  on4Enter() {
    this.autoCompleteDisabled4 = false;
    this._myAutocompleteTrigger4.openPanel();
  }

  on3Change(event) {
    console.log("on3change called");
    this.autoCompleteDisabled3 = true;
    this._myAutocompleteTrigger3.closePanel();
  }

  on4Change(event) {
    console.log("on4change called");
    this.autoCompleteDisabled4 = true;
    this._myAutocompleteTrigger4.closePanel();
  }

  autoCompleteDisabled3 = true;
  autoCompleteDisabled4 = true;

  isAutoComplete3Disabled() {
    return this.autoCompleteDisabled3;
  }

  isAutoComplete4Disabled() {
    return this.autoCompleteDisabled4;
  }

}
