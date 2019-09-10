import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { DialogReactionComponent } from './dialogs/reaction/dialog-reaction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogVaccinationComponent } from './dialogs/vaccination/dialog-vaccination.component';
import { DialogProblemComponent } from './dialogs/problem/dialog-problem.component';
import { DialogMedicationComponent } from './dialogs/medication/dialog-medication.component';
import { DialogInvestigationComponent } from './dialogs/investigation/dialog-investigation.component';
import { DialogProcedureComponent } from './dialogs/procedure/dialog-procedure.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { EncounterFrameComponent } from './frames/encounter-frame/encounter-frame.component';
import { ReactionFrameComponent } from './frames/reaction-frame/reaction-frame.component';
import { PatientDetailsFrameComponent } from './frames/patient-details-frame/patient-details-frame.component';
import { PatientSummaryFrameComponent } from './frames/patient-summary-frame/patient-summary-frame.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogReactionComponent,
    DialogVaccinationComponent,
    DialogProblemComponent,
    DialogMedicationComponent,
    DialogInvestigationComponent,
    DialogProcedureComponent,
    DialogReactionComponent,
    EncounterFrameComponent,
    ReactionFrameComponent,
    PatientDetailsFrameComponent,
    PatientSummaryFrameComponent
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
    DialogReactionComponent,
    DialogVaccinationComponent,
    DialogProblemComponent,
    DialogMedicationComponent,
    DialogInvestigationComponent,
    DialogProcedureComponent,
    DialogReactionComponent
  ]
})
export class AppModule { }
