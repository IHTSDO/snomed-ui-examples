import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValueSet } from 'fhir-stu3';
import { Observable } from 'rxjs';
import {debounceTime, switchMap, tap, finalize, distinctUntilChanged} from 'rxjs/operators';
import { SnomedConcept } from 'src/app/demo-model.service';


export interface User {
  value: string;
  display: string;
}

@Component({
  selector: 'dialog-reaction-frame',
  templateUrl: 'dialog-reaction.component.html',
  styleUrls: ['dialog-reaction.component.css']
})
export class DialogReactionComponent implements OnInit {

  snomedServer: string;
  httpSubscription;

  substanceURL: string;

  // criticality
  criticalityOptions = {'High': '75540009', 'Low': '62482003', 'Indeterminate': '82334004'};

  reactionForm = new FormGroup({
    substance: new FormControl(''),
    criticality: new FormControl(''),
    manifestations: new FormControl(''),
    verificationStatus: new FormControl(''),
    comment: new FormControl('')
  });

  manifestationURL: string;

  constructor(private httpClient: HttpClient, private dialogRef: MatDialogRef<DialogReactionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.snomedServer = data['snomedServer'];
  }

  filteredSubstanceValues : SnomedConcept[] = [];
  filteredManifestationValues : SnomedConcept[] = [];


  displaySubstanceFn(code) {
    if (!code) return '';
    for (var entry in this.filteredSubstanceValues) {
      if (this.filteredSubstanceValues[entry]['value'] === code) {
        return this.filteredSubstanceValues[entry]['display'];
      }
    }
  }

  displayManifestationFn(code) {
    if (!code) return '';
    for (var entry in this.filteredManifestationValues) {
      if (this.filteredManifestationValues[entry]['value'] === code) {
        return this.filteredManifestationValues[entry]['display'];
      }
    }
  }


  ngOnInit() {

    this.reactionForm.get('substance').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
      }),
      switchMap(value => this.httpClient.get<ValueSet>(this.substanceURL + '&filter=' + value)
        .pipe(
          finalize(() => {
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


    this.reactionForm.get('manifestations').valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
      }),
      switchMap(value => this.httpClient.get<ValueSet>(this.manifestationURL + '&filter=' + value)
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

    this.substanceURL = this.snomedServer + '/ValueSet/$expand?url=http%3A%2F%2Fsnomed.info%2Fsct%3Ffhir_vs%3Decl%2F%3C%20105590001%20OR%20%3C%20373873005&count=20&includeDesignations=true';
    this.manifestationURL = this.snomedServer + '/ValueSet/$expand?_format=json&url=http:%2F%2Fsnomed.info%2Fsct?fhir_vs=isa%2F404684003&count=20&includeDesignations=true';

    // initialize the drop-downs with some data so it appears like the search is working
    this.httpSubscription = this.httpClient.get<ValueSet>(this.substanceURL)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.filteredSubstanceValues.push({value: val.code, display: val.display});
        })
      });
    var manifestationSubscription = this.httpClient.get<ValueSet>(this.manifestationURL)
      .subscribe(result => {
        console.log("result=", result);
        result.expansion.contains.forEach(val => {
          this.filteredManifestationValues.push({value: val.code, display: val.display});
        })
        manifestationSubscription.unsubscribe();
      });

  }

  ngOnDestroy() {
    this.httpSubscription.unsubscribe();
  }

  save() {
    //console.log("values=", this.reactionForm.value);
    this.dialogRef.close({event:"save", data:this.reactionForm.value});
  }

  getCriticalityCode(key) {
    return this.criticalityOptions[key];
  }

  getCriticalityKeys() : Array<string> {
    return Object.keys(this.criticalityOptions);
  }

}