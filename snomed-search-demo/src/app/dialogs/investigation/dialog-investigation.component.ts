import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dialog-investigation.component',
  templateUrl: 'dialog-investigation.component.html',
  styleUrls: ['dialog-investigation.component.css']
})
export class DialogInvestigationComponent {

  investigationForm = new FormGroup({
    test:new FormControl(''),
    date:new FormControl(''),
    result:new FormControl(''),
  });

  constructor(private dialogRef: MatDialogRef<DialogInvestigationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  save() {

    this.dialogRef.close({event:"save", data:this.investigationForm.value});
  }
}