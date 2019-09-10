import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dialog-medication.component',
  templateUrl: 'dialog-medication.component.html',
  styleUrls: ['dialog-medication.component.css']
})
export class DialogMedicationComponent {

  medicationForm = new FormGroup({
    name:new FormControl(''),
    strength:new FormControl(''),
    form:new FormControl(''),
    route:new FormControl(''),
    freq:new FormControl(''),
    duration:new FormControl(''),
    instruction:new FormControl(''),
    clinicalIndication:new FormControl(''),
    comment:new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<DialogMedicationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  save() {

    this.dialogRef.close({event:"save", data:this.medicationForm.value});
  }
}