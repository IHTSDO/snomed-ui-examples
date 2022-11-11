import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-investigations-frame',
  templateUrl: './investigations-frame.component.html',
  styleUrls: ['./investigations-frame.component.css']
})
export class InvestigationsFrameComponent implements OnInit {

  @Input() snomedServer: string;

  displayedDiagnosticImagingInvestigationsColumns : string[] = ['presentingProblemDisplay', 'radiologyServiceDisplay', 'additionalNotes', 'contrastMaterialDisplay'];
  diagnosticImagingInvestigationDataSource = new MatTableDataSource(this.demoModelService.getDiagnosticImagingInvestigations());
  
  filteredPresentingProblemValues : SnomedConcept[] = [];
  filteredModalityValues : SnomedConcept[] = [];
  filteredTargetSiteValues : SnomedConcept[] = [];
  filteredServiceRequestValues : SnomedConcept[] = [];
  filteredContrastMaterialValues : SnomedConcept[] = [];
  sideValues: SnomedConcept[] = [
    {display: 'Left', value: '7771000'}, 
    {display: 'Right', value: '24028007'},  
    {display: 'Bilateral', value: '51440002'}
  ];
  extractedModalityValues: SnomedConcept[] = [];
  extractedSiteValues: SnomedConcept[] = [];
  extractedLateralityValues: SnomedConcept[] = [];
  searchingExtractedModalityValues: boolean = false;
  searchingExtractedSiteValues: boolean = false;
  searchingExtractedLateralityValues: boolean = false;

  investigationsForm = new FormGroup({
    presentingProblem: new FormControl(''),
    side: new FormControl(''),
    modality: new FormControl(''),
    targetSite: new FormControl(''),
    serviceRequest: new FormControl(''),
    contrastMaterial: new FormControl(''),
    additionalNotes: new FormControl(''), 
    extractedModality: new FormControl({value: '', disabled: true}),
    extractedSite: new FormControl({value: '', disabled: true}),
    extractedLaterality: new FormControl({value: '', disabled: true}),
  });

  presentingProblemChangeSubsciption : Subscription;
  modalityChangeSubscription: Subscription;
  targetSiteChangeSubscription: Subscription;
  serviceRequestChangeSubscription: Subscription;
  contrastMaterialChangeSubscription: Subscription;

  constructor(private httpClient: HttpClient, private demoModelService: DemoModelService) { 
  }

  ngOnInit(): void {

    const PRESENTING_PROBLEM_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://aehrc.com/valueset/reason-for-encounter') 
    + '&count=20&includeDesignations=true';
    // SI Version
    // const ENCOUNTER_REASON_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 404684003 OR < 71388002 OR < 243796009 OR < 272379006')
    // + '&count=20&includeDesignations=true';

    const MODALITY_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://www.ranzcr.com/fhir/ValueSet/Radiology-Procedure') 
    + '&count=20&includeDesignations=true';

    const TARGET_SITE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('https://www.ranzcr.com/fhir/ValueSet/Radiology-Service-Site') 
    + '&count=20&includeDesignations=true';

    // const SERVICE_REQUEST_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 363679005')
    // + '&count=20&includeDesignations=true';

    const CONTRAST_MATERIAL_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('<< 385420005')
    + '&count=20&includeDesignations=true';

    var presentingProblemFilter;
    this.presentingProblemChangeSubsciption = this.investigationsForm.get('presentingProblem').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        presentingProblemFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(PRESENTING_PROBLEM_URL + '&filter=' + presentingProblemFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredPresentingProblemValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredPresentingProblemValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredPresentingProblemValues.push({display: presentingProblemFilter, value: null});        
      }

    });

    var modalityFilter;
    this.modalityChangeSubscription = this.investigationsForm.get('modality').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        modalityFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(MODALITY_URL + '&filter=' + modalityFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredModalityValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredModalityValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredModalityValues.push({display: modalityFilter, value: null});
      }
    });

    var targetSiteFilter;
    this.targetSiteChangeSubscription = this.investigationsForm.get('targetSite').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        targetSiteFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(TARGET_SITE_URL + '&filter=' + targetSiteFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredTargetSiteValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredTargetSiteValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredTargetSiteValues.push({display: targetSiteFilter, value: null});
      }
    });

    var serviceRequestFilter;
    this.serviceRequestChangeSubscription = this.investigationsForm.get('serviceRequest').valueChanges
    .pipe(
      tap((value) => {console.log("SR change triggered")}),
      debounceTime(500),
      //distinctUntilChanged(),
      tap((value) => {
        serviceRequestFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(this.getServiceRequestURL(
        this.investigationsForm.get('modality').value.value, 
        this.investigationsForm.get('targetSite').value.value, 
        this.investigationsForm.get('side').value.value) + '&filter=' + serviceRequestFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredServiceRequestValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredServiceRequestValues.push({value: val.code, display: val.display});
        });
      }
      else {
        if (serviceRequestFilter.trim().length !== 0) {
          this.filteredServiceRequestValues.push({display: serviceRequestFilter, value: null});
        }
      }
    });

    var contrastMaterialFilter;
    this.contrastMaterialChangeSubscription = this.investigationsForm.get('contrastMaterial').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        contrastMaterialFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(CONTRAST_MATERIAL_URL + '&filter=' + contrastMaterialFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredContrastMaterialValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredContrastMaterialValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredContrastMaterialValues.push({display: contrastMaterialFilter, value: null});
      }
    });

    // trigger initial population of list
    this.investigationsForm.get('serviceRequest').setValue("");
  }

  ngOnDestroy() {
    this.presentingProblemChangeSubsciption.unsubscribe();
    this.modalityChangeSubscription.unsubscribe();
    this.targetSiteChangeSubscription.unsubscribe();
    this.serviceRequestChangeSubscription.unsubscribe();
    this.contrastMaterialChangeSubscription.unsubscribe();
  }


  getServiceRequestURL(modalityConceptID: string, siteConceptID: string, lateralityConceptID: string) {

    // FORMING A QUERY LIKE THIS
    // (<<~MODALITY~) {{ term = "term"}}
    // AND (ANY:405813007|ProcedureSite-Direct|=(~TARGETSITE~:272741003|Laterality|=~LATERALITYVALUE~))
    // 
    // IF NO MODALITY, USE 363679005| Imaging (procedure)|
    
    let serviceRequestURL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/');

    let ecl = '(<<';

    if (modalityConceptID) {
      ecl += modalityConceptID;
    }
    else {
      ecl += '363679005| Imaging (procedure)|';
    }
    ecl += ') '

    //Some "magic" to handle bilaterality in ECL
    //No concept is actually modelled with the 51440002|left and right| concept
    //Check that there is at least two procedure sites, with left/right.
    //not ideal, some more complex logic around composing the ECL would be better, but more complex
    let bilateralCardinality = '';
    if (lateralityConceptID=='51440002') {
      bilateralCardinality = '[2..*]'
      lateralityConceptID ='(7771000|Left| or 24028007|Right|)';
    }

    // Can handle any combination of site and/or laterality.
    if (siteConceptID && lateralityConceptID) {
      ecl += 'AND (<<363679005|Imaging|:'+bilateralCardinality+'405813007|ProcedureSite-Direct|=(<<' + siteConceptID + ':272741003|Laterality|=' + lateralityConceptID +'))';
    } else if (siteConceptID) {
      ecl += 'AND (<<363679005|Imaging|:'+bilateralCardinality+'405813007|ProcedureSite-Direct|=(<<' + siteConceptID + '))';
    } else if (lateralityConceptID) {
      ecl += 'AND (<<363679005|Imaging|:'+bilateralCardinality+'405813007|ProcedureSite-Direct|=(<<123037004|BodyStructure|'+ ':272741003|Laterality|=' + lateralityConceptID +'))';
    }

    serviceRequestURL += encodeURIComponent(ecl) + '&count=20&includeDesignations=true';

    console.log("serviceRequestURL", serviceRequestURL);
    return serviceRequestURL;
  }

  displayFn(code) {
    if (!code) return '';
    return code.display;
  }

  compareValues(value1: any, value2: any): boolean {
    var equal = false;
    if (value1 && value2) {
      if (value1.value === value2.value) {
        equal = true;
      }
    }
    return equal;
  }

  refreshServiceRequestList() {
    this.filteredServiceRequestValues = [];
    this.investigationsForm.get('serviceRequest').setValue("");
  }

  onSelectModality(selectedModality) {
    this.refreshServiceRequestList();
  }

  onSelectTargetSite(selectedTargetSite) {
    this.refreshServiceRequestList();
  }

  onSelectLaterality(selectedLaterality) {
    this.refreshServiceRequestList();
  }

  // do this if we want to force the dropdown to be immediately populated
  // onClickTargetSite() {
  //   this.investigationsForm.get('targetSite').setValue(this.investigationsForm.get('targetSite').value);
  // }

  onSelectServiceRequest(selectedServiceRequest) {
    console.log("Service request selected", selectedServiceRequest);

    this.extractedModalityValues = [];
    this.extractedSiteValues = [];
    this.extractedLateralityValues = [];

    this.searchingExtractedModalityValues = true;
    this.searchingExtractedSiteValues = true;
    this.searchingExtractedLateralityValues = true;
    
    this.investigationsForm.get('extractedModality').setValue('');
    this.investigationsForm.get('extractedSite').setValue('');
    this.investigationsForm.get('extractedLaterality').setValue('');

    const EXTRACT_MODALITY_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('('+selectedServiceRequest.value+'.260686004) AND <<360037004|Imaging - action (qualifier value)|')
    + '&count=20&includeDesignations=true';

    const EXTRACT_SITE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('((' + selectedServiceRequest.value + '.405813007|ProcedureSite-Direct|))')
    + '&count=20&includeDesignations=true';

    const EXTRACT_LATERALITY_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('((' + selectedServiceRequest.value + '.405813007|ProcedureSite-Direct|).272741003|Laterality|) MINUS 182353008|Side|')
    + '&count=20&includeDesignations=true';

    var modalitySubscription = this.httpClient.get<ValueSet>(EXTRACT_MODALITY_URL)
      .subscribe(result => {
        console.log("result", result);
        if (result.expansion.contains) {
          result.expansion.contains.forEach(val => {
            console.log("modality values", val);
            this.investigationsForm.get('extractedModality').setValue(val.display);
            this.extractedModalityValues.push({value: val.code, display: val.display});
          })
        }
        this.searchingExtractedModalityValues = false;
        modalitySubscription.unsubscribe();
      });

    var siteSubscription = this.httpClient.get<ValueSet>(EXTRACT_SITE_URL)
      .subscribe(result => {
        console.log("result", result);
        if (result.expansion.contains) {
          result.expansion.contains.forEach(val => {
            console.log("site values", val)
            this.investigationsForm.get('extractedSite').setValue(val.display);
            this.extractedSiteValues.push({value: val.code, display: val.display});
          })
        }
        this.searchingExtractedSiteValues = false;
        siteSubscription.unsubscribe();
      });

    var lateralitySubscription = this.httpClient.get<ValueSet>(EXTRACT_LATERALITY_URL)
      .subscribe(result => {
        console.log("result", result);
        if (result.expansion.contains) {
          result.expansion.contains.forEach(val => {
            console.log("laterality values", val)
            this.investigationsForm.get('extractedLaterality').setValue(val.display);
            this.extractedLateralityValues.push({value: val.code, display: val.display});
          })
        }
        this.searchingExtractedLateralityValues = false;
        lateralitySubscription.unsubscribe();
      });
  }

  onSaveDiagnosticImagingInvestigation() {

    this.demoModelService.addDiagnosticImagingInvestigation(
      this.investigationsForm.get('presentingProblem').value ? this.investigationsForm.get('presentingProblem').value.value : null,
      this.investigationsForm.get('presentingProblem').value ? this.investigationsForm.get('presentingProblem').value.display : null,     
      this.investigationsForm.get('serviceRequest').value ? this.investigationsForm.get('serviceRequest').value.value : null,
      this.investigationsForm.get('serviceRequest').value ? this.investigationsForm.get('serviceRequest').value.display : null,
      this.investigationsForm.get('contrastMaterial').value ? this.investigationsForm.get('contrastMaterial').value.value : null,
      this.investigationsForm.get('contrastMaterial').value ? this.investigationsForm.get('contrastMaterial').value.display : null, 
      this.investigationsForm.get('additionalNotes').value,
    );

    // cause table refresh
    this.diagnosticImagingInvestigationDataSource = new MatTableDataSource(this.demoModelService.getDiagnosticImagingInvestigations());
    
    // empty fields for diagnostic imaging investigation to be added
    this.investigationsForm.reset({ side: this.sideValues[0] });

    this.filteredPresentingProblemValues = [];
    this.filteredModalityValues = [];
    this.filteredTargetSiteValues = [];
    this.filteredServiceRequestValues = [];
    this.filteredContrastMaterialValues = [];

  }

  isMatBadgeHidden(conceptID) {
    if (conceptID) {
      return false;
    }
    return true;
  }

}
