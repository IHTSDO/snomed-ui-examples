import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dialog-procedure.component',
  templateUrl: 'dialog-procedure.component.html',
  styleUrls: ['dialog-procedure.component.css']
})
export class DialogProcedureComponent {

  procedureForm = new FormGroup({
    name:new FormControl(''),
    date:new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<DialogProcedureComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  save() {

    this.dialogRef.close({event:"save", data:this.procedureForm.value});
  }
}