import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { ValueSet } from 'fhir-stu3';
import { DemoModelService, SnomedConcept } from 'src/app/demo-model.service';
import { Subscription } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';

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
  criticalityValues: SnomedConcept[] = [
    {display: 'Low', value: '62482003'}, 
    {display: 'High', value: '75540009'},  
    {display: 'Indeterminate', value: '82334004'}
  ];
  manifestations: string[] = [];

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

    const MANIFESTATION_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://aehrc.com/valueset/reaction-manifestation') 
    + '&count=20&includeDesignations=true';
    // SI Version
    // const MANIFESTATION_URL = this.snomedServer + '/ValueSet/$expand?url=' + encodeURIComponent('http://snomed.info/sct') 
    // + encodeURIComponent('?fhir_vs=isa/404684003')
    // + '&count=20&includeDesignations=true';

    var substanceFilter;
    this.substanceChangeSubsciption = this.reactionForm.get('substance').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        substanceFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(SUBSTANCE_URL + '&filter=' + substanceFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredSubstanceValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredSubstanceValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredSubstanceValues.push({display: substanceFilter, value: null});        
      }

    });

    var manifestationFilter;
    this.manifestationChangeSubscription = this.reactionForm.get('manifestations').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        manifestationFilter = (value instanceof Object) ? value.display : value;
      }),
      switchMap(value => this.httpClient.get<ValueSet>(MANIFESTATION_URL + '&filter=' + manifestationFilter)
        .pipe(
          finalize(() => {
          }),
        )
      )
    )
    .subscribe(data => {
      this.filteredManifestationValues = [];
      if (data.expansion.contains) {
        data.expansion.contains.forEach(val => {
          this.filteredManifestationValues.push({value: val.code, display: val.display});
        });
      }
      else {
        this.filteredManifestationValues.push({display: manifestationFilter, value: null});
      }
    });

  }

  ngOnDestroy() {
    this.substanceChangeSubsciption.unsubscribe();
    this.manifestationChangeSubscription.unsubscribe();
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

  onSaveReaction() {

    this.demoModelService.addReaction(
      this.reactionForm.get('substance').value ? this.reactionForm.get('substance').value.value : null,
      this.reactionForm.get('substance').value ? this.reactionForm.get('substance').value.display : null,
      this.reactionForm.get('criticality').value ? this.reactionForm.get('criticality').value.value : null,
      this.reactionForm.get('criticality').value ? this.reactionForm.get('criticality').value.display : null,
      this.manifestations,
      this.reactionForm.get('verificationStatus').value,   
      this.reactionForm.get('comment').value,
    );

    // cause table refresh
    this.reactionDataSource = new MatTableDataSource(this.demoModelService.getReactions(undefined));
    
    // empty fields for another reaction to be added
    this.reactionForm.reset({ criticality: this.criticalityValues[0] });

    this.filteredSubstanceValues = [];
    this.filteredSubstanceValues = [];
    this.manifestations = [];
  }

  // multi manifestation functionality below

  selectable = false;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('manifestationsInput') manifestationsInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoManifestation') matAutocomplete: MatAutocomplete;

  add(event: MatChipInputEvent): void {
    // Add  only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add manifestation
      if ((value || '').trim()) {
        this.manifestations.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.reactionForm.get('manifestations').setValue(null);
    }
  }

  remove(manifestation: string): void {
    const index = this.manifestations.indexOf(manifestation);

    if (index >= 0) {
      this.manifestations.splice(index, 1);
    }
  }

  manifestationsSelected(manifestation): void {
    this.manifestations.push(manifestation);
    this.manifestationsInput.nativeElement.value = '';
  }  

  isMatBadgeHidden(conceptID) {
    if (conceptID) {
      return false;
    }
    return true;
  }

}
