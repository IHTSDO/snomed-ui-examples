import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { EncounterFrameComponent } from './frames/encounter-frame/encounter-frame.component';
import { ReactionFrameComponent } from './frames/reaction-frame/reaction-frame.component';
import { PatientDetailsFrameComponent } from './frames/patient-details-frame/patient-details-frame.component';
import { PatientSummaryFrameComponent } from './frames/patient-summary-frame/patient-summary-frame.component';
import { SearchCompareFrameComponent } from './frames/search-compare-frame/search-compare-frame.component';
import { InvestigationsFrameComponent } from './frames/investigations-frame/investigations-frame.component';

@NgModule({
  declarations: [
    AppComponent,
    EncounterFrameComponent,
    ReactionFrameComponent,
    InvestigationsFrameComponent,
    PatientDetailsFrameComponent,
    PatientSummaryFrameComponent,
    SearchCompareFrameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule { }
