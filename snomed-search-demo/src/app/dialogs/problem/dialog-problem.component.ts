import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dialog-problem.component',
  templateUrl: 'dialog-problem.component.html',
  styleUrls: ['dialog-problem.component.css']
})
export class DialogProblemComponent {

  problemForm = new FormGroup({
    name:new FormControl(''),
    date:new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<DialogProblemComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  save() {

    this.dialogRef.close({event:"save", data:this.problemForm.value});
  }
}