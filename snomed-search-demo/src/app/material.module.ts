import { NgModule } from '@angular/core';
import { MdePopoverModule } from '@material-extended/mde';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MdePopoverModule,
    MatListModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,     
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatListModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MdePopoverModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ]
})
export class MaterialModule {}