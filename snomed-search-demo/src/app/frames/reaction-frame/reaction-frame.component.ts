import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-reaction-frame',
  templateUrl: './reaction-frame.component.html',
  styleUrls: ['./reaction-frame.component.css']
})
export class ReactionFrameComponent implements OnInit {

  @Input() snomedServer: string;

  displayedReactionColumns : string[] = ['substanceDisplay', 'criticalityDisplay', 'manifestationDisplay', 'verificationStatus', 'comment'];
  reactionDataSource = new MatTableDataSource(this.demoModelService.getReactions(undefined));
  
  filteredSubstanceValues : SnomedConcept[] = [];
  filteredManifestationValues : SnomedConcept[] = [];
  //criticalityValues : SnomedConcept[] = [];
  criticalityValues: SnomedConcept[] = [
    {display: 'Low', value: '62482003'}, 
    {display: 'High', value: '75540009'},  
    {display: 'Indeterminate', value: '82334004'}
  ];

  reactionForm = new FormGroup({
    substance: new FormControl(''),
    criticality: new FormControl(this.criticalityValues[0]),
    manifestations: new FormControl(''),
    verificationStatus: new FormControl(''),
    comment: new FormControl('')
  });

  substanceChangeSubsciption : Subscription;
  manifestationChangeSubscription: Subscription;

  constructor(private httpClient: HttpClient, private demoModelService: DemoModelService) { 
  }

  ngOnInit(): void {

    const SUBSTANCE_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('< 105590001 OR < 373873005')
    + '&count=20&includeDesignations=true';

    const MANIFESTATION_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    + encodeURIComponent('?fhir_vs=isa/404684003')
    + '&count=20&includeDesignations=true';

    // const CRITICALITY_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=ecl/') + encodeURIComponent('75540009 OR 62482003 OR 82334004');
    // // this.substanceURL = this.snomedServer + '/ValueSet/$expand?url=http%3A%2F%2Fsnomed.info%2Fsct%3Ffhir_vs%3Decl%2F%3C%20105590001%20OR%20%3C%20373873005&count=20&includeDesignations=true';
    // this.manifestationURL = this.snomedServer + '/ValueSet/$expand?_format=json&url=http:%2F%2Fsnomed.info%2Fsct?fhir_vs=isa%2F404684003&count=20&includeDesignations=true';

    this.substanceChangeSubsciption = this.reactionForm.get('substance').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
      }),
      switchMap(value => this.httpClient.get<ValueSet>(SUBSTANCE_URL + '&filter=' + ((typeof value === 'string') ? value : value.display))
        .pipe(
          finalize(() => {
            console.log("value", value);
            console.log("value.display", value.display);
            console.log("value.value", value.value);
            console.log("value instanceof Object", value instanceof Object)
          }),
        )
      )
    )
    .subscribe(data => {
      if (data.expansion.contains) {
        this.filteredSubstanceValues = [];
        data.expansion.contains.forEach(val => {
          this.filteredSubstanceValues.push({value: val.code, display: val.display});
        });
      }
    });

    this.manifestationChangeSubscription = this.reactionForm.get('manifestations').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
      }),
      switchMap(value => this.httpClient.get<ValueSet>(MANIFESTATION_URL + '&filter=' + ((typeof value === 'string') ? value : value.display))
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      if (data.expansion.contains) {
        this.filteredManifestationValues = [];
        data.expansion.contains.forEach(val => {
          this.filteredManifestationValues.push({value: val.code, display: val.display});
        });
      }
    });


    // initialize the drop-downs with some data so it appears like the search is working
    // var substanceSubscription = this.httpClient.get<ValueSet>(SUBSTANCE_URL)
    //   .subscribe(result => {
    //     result.expansion.contains.forEach(val => {
    //       this.filteredSubstanceValues.push({value: val.code, display: val.display});
    //     })
    //     substanceSubscription.unsubscribe();
    //   });

    // var manifestationSubscription = this.httpClient.get<ValueSet>(MANIFESTATION_URL)
    //   .subscribe(result => {
    //     result.expansion.contains.forEach(val => {
    //       this.filteredManifestationValues.push({value: val.code, display: val.display});
    //     })
    //     manifestationSubscription.unsubscribe();
    //   });

    // var criticalitySubscription = this.httpClient.get<ValueSet>(CRITICALITY_URL)
    // .subscribe(result => {
    //   result.expansion.contains.forEach(val => {
    //     this.criticalityValues.push({value: val.code, display: val.display});
    //   })
    //   criticalitySubscription.unsubscribe();
    // });

  }

  ngOnDestroy() {
    this.substanceChangeSubsciption.unsubscribe();
    this.manifestationChangeSubscription.unsubscribe();
  }

  displayFn(code) {
    if (!code) return '';
    return code.display;
    // for (var entry in this.filteredSubstanceValues) {
    //   if (this.filteredSubstanceValues[entry]['value'] === code) {
    //     return this.filteredSubstanceValues[entry]['display'];
    //   }
    // }
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

  // getCriticalityKeys() : Array<string> {
  //   return Object.keys(this.criticalityOptions);
  // }

  // getCriticalityCode(key) {
  //   return this.criticalityOptions[key];
  // }

  onSaveReaction() {

    this.demoModelService.addReaction(
      this.reactionForm.get('substance').value.value,
      this.reactionForm.get('substance').value.display,
      this.reactionForm.get('criticality').value.value,
      this.reactionForm.get('criticality').value.display,
      this.reactionForm.get('manifestations').value.value,
      this.reactionForm.get('manifestations').value.display,  
      this.reactionForm.get('verificationStatus').value,   
      this.reactionForm.get('comment').value,
    );

    // cause table refresh
    this.reactionDataSource = new MatTableDataSource(this.demoModelService.getReactions(undefined));
    
    // empty fields for another reaction to be added
    this.reactionForm.get('substance').reset();
    this.reactionForm.get('criticality').reset();
    this.reactionForm.get('manifestations').reset(); 
    this.reactionForm.get('verificationStatus').reset();
    this.reactionForm.get('comment').reset();
  }

}
