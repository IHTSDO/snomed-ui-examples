import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-compare-frame',
  templateUrl: './search-compare-frame.component.html',
  styleUrls: ['./search-compare-frame.component.css']
})
export class SearchCompareFrameComponent implements OnInit {

  //@ViewChild('goodAutocompleteTrigger', { static: true }) private _goodAutocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('myAutocompleteTrigger3', { static: true }) private _myAutocompleteTrigger3: MatAutocompleteTrigger;
  @ViewChild('myAutocompleteTrigger4', { static: true }) private _myAutocompleteTrigger4: MatAutocompleteTrigger;

  @Input() snomedServer: string;

  currentBadDiagnosisField = 0;
  goodSearchDropdownDisplayed = false;
  badSearchDropdownDisplayed = false;


  filteredGoodDiagnosis0Values: SnomedConcept[] = [];
  goodDiagnosis0Values: string[] = [];
  filteredBadDiagnosis0Values: SnomedConcept[] = [];
  badDiagnosis0Values: string[] = [];

  filteredBadDiagnosis1Values: SnomedConcept[] = [];
  badDiagnosis1Values: string[] = [];

  filteredBadDiagnosis2Values: SnomedConcept[] = [];
  badDiagnosis2Values: string[] = [];

  filteredBadDiagnosis3Values: SnomedConcept[] = [];
  badDiagnosis3Values: string[] = [];

  filteredBadDiagnosis4Values: SnomedConcept[] = [];
  badDiagnosis4Values: string[] = [];

  searchComparisonForm = new FormGroup({
    goodDiagnosis0: new FormControl(''),
    badDiagnosis0: new FormControl(''),
    badDiagnosis1: new FormControl(''),
    badDiagnosis2: new FormControl(''),
    badDiagnosis3: new FormControl(''),
    badDiagnosis4: new FormControl(''),
    searchType: new FormControl('')
  });

  goodDiagnosis0ChangeSubsciption: Subscription;
  badDiagnosis0ChangeSubsciption: Subscription;
  badDiagnosis1ChangeSubsciption: Subscription;
  badDiagnosis2ChangeSubsciption: Subscription;
  badDiagnosis3ChangeSubsciption: Subscription;
  badDiagnosis4ChangeSubsciption: Subscription;
  searchTypeChangeSubscription: Subscription;

  constructor(private httpClient: HttpClient, private demoModelService: DemoModelService,
    private ref: ChangeDetectorRef) {
  }

  handleGoodClose(trigger) {

    if (this.goodSearchDropdownDisplayed) {
      Promise.resolve().then(() => trigger.openPanel());
    }
    
  }

  handleBadClose(trigger) {

    if (this.badSearchDropdownDisplayed) {
      Promise.resolve().then(() => trigger.openPanel());
    }
    
  }

  ngOnInit(): void {

    const DIAGNOSIS_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://healthterminologies.gov.au/fhir/ValueSet/clinical-condition-1')
      + '&count=20&includeDesignations=true';

    const ALL_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct')
      + encodeURIComponent('?fhir_vs=isa/138875005') + '&count=20&includeDesignations=true';
      
    this.searchTypeChangeSubscription = this.searchComparisonForm.get('searchType').valueChanges
      .subscribe(searchType => {

        switch (searchType) {
          case "multipleDescriptions": {
            this.currentBadDiagnosisField = 0;
            break;
          }
          case "alphabeticalOrder": {
            this.currentBadDiagnosisField = 1;
            break;
          }
          case "wrongBinding": {
            this.currentBadDiagnosisField = 2;            
            break;
          }
          case "enterForResults": {
            this.currentBadDiagnosisField = 3;
            break;
          }
          case "multipleBadPractices": {
            this.currentBadDiagnosisField = 4;
            break;
          }
        }

        this.searchComparisonForm.get('goodDiagnosis0').setValue("");

        switch (this.currentBadDiagnosisField) {
          case 0: {
            this.searchComparisonForm.get('badDiagnosis0').setValue("");
            break;
          }
          case 1: {
            this.searchComparisonForm.get('badDiagnosis1').setValue("");
            break;
          }
          case 2: {
            this.searchComparisonForm.get('badDiagnosis2').setValue("");
            break;
          }
          case 3: {
            this.searchComparisonForm.get('badDiagnosis3').setValue("");
            break;
          }
          case 4: {
            this.searchComparisonForm.get('badDiagnosis4').setValue("");
            break;
          }
        }

        this.goodSearchDropdownDisplayed = false;
        this.badSearchDropdownDisplayed = false;
      });

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
            this.filteredGoodDiagnosis0Values.push({ value: val.code, display: val.display });
          });
        }
        else {
          this.filteredGoodDiagnosis0Values.push({ display: goodDiagnosis0Filter, value: null });
        }
        this.goodSearchDropdownDisplayed = true;

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
              this.filteredBadDiagnosis0Values.push({ value: val.code, display: designation.value });
            })
          });
        }
        else {
          this.filteredBadDiagnosis0Values.push({ display: badDiagnosis0Filter, value: null });
        }
        this.badSearchDropdownDisplayed = true;

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
            this.filteredBadDiagnosis1Values.push({ value: val.code, display: val.display });
          });
        }
        else {
          this.filteredBadDiagnosis1Values.push({ display: badDiagnosis1Filter, value: null });
        }
        this.filteredBadDiagnosis1Values.sort((a, b) => a.display.localeCompare(b.display));
        this.badSearchDropdownDisplayed = true;

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
            this.filteredBadDiagnosis2Values.push({ value: val.code, display: val.display });
          });
        }
        else {
          this.filteredBadDiagnosis2Values.push({ display: badDiagnosis2Filter, value: null });
        }
        this.badSearchDropdownDisplayed = true;

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
            this.filteredBadDiagnosis3Values.push({ value: val.code, display: val.display });
          });
        }
        else {
          this.filteredBadDiagnosis3Values.push({ display: badDiagnosis3Filter, value: null });
        }
        this.badSearchDropdownDisplayed = true;

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
            this.filteredBadDiagnosis4Values.push({ value: val.code, display: val.display });
          });
        }
        else {
          this.filteredBadDiagnosis4Values.push({ display: badDiagnosis4Filter, value: null });
        }
        this.filteredBadDiagnosis4Values.sort((a, b) => a.display.localeCompare(b.display));
        this.badSearchDropdownDisplayed = true;
      });


  }

  public ngAfterViewInit() 
  {
      this.ref.detectChanges();
  }

  ngOnDestroy() {
    this.goodDiagnosis0ChangeSubsciption.unsubscribe();
    this.badDiagnosis1ChangeSubsciption.unsubscribe();
    this.badDiagnosis2ChangeSubsciption.unsubscribe();
    this.badDiagnosis3ChangeSubsciption.unsubscribe();
    this.badDiagnosis4ChangeSubsciption.unsubscribe();
    this.searchTypeChangeSubscription.unsubscribe();

  }

  displayFn(code) {
    if (!code) return '';
    return code.display;
  }

  on3Enter() {
    this.autoCompleteDisabled3 = false;
    this._myAutocompleteTrigger3.openPanel();
  }

  on4Enter() {
    this.autoCompleteDisabled4 = false;
    this._myAutocompleteTrigger4.openPanel();
  }

  on3Change(event) {
    this.autoCompleteDisabled3 = true;
    this._myAutocompleteTrigger3.closePanel();

  }

  on4Change(event) {
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

  getExplanation(): string {

    switch (this.searchComparisonForm.get('searchType').value) {
      case "multipleDescriptions": {
        return "Avoid multiple descriptions of the same concept."
      }
      case "alphabeticalOrder": {
        return "Do not sort options alphabetically.";
      }
      case "wrongBinding": {
        return "Always bind to a subset of SNOMED-CT, never allow all concepts in SNOMED-CT";
      }
      case "enterForResults": {
        return "Options can be dynamically displayed";
      }
      case "multipleBadPractices": {
        return "Locating the correct SNOMED-CT concept becomes a near impossible task.";
      }
      default: {
        return "Avoid multiple descriptions of the same concept.";
      }
    }
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



  isBadDiagnosisVisible(fieldNum: number): boolean {

    if (this.currentBadDiagnosisField === fieldNum) {
      return true;
    }
    return false;

  }

}
