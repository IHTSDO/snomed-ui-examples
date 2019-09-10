import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dialog-vaccination.component',
  templateUrl: 'dialog-vaccination.component.html',
  styleUrls: ['dialog-vaccination.component.css']
})
export class DialogVaccinationComponent {

  vaccinationForm = new FormGroup({
    name:new FormControl(''),
    brandName:new FormControl(''),
    substance:new FormControl(''),
    date:new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<DialogVaccinationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  save() {

    this.dialogRef.close({event:"save", data:this.vaccinationForm.value});
  }
}