import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValueSet} from 'fhir-stu3';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DemoModelService } from './demo-model.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('problemTable', {static:true}) problemTable: MatTable<any>;
  @ViewChild('vaccinationTable', {static:true}) vaccinationTable: MatTable<any>;
  @ViewChild('pathologyInvestigationTable', {static:true}) pathologyInvestigationTable: MatTable<any>;
  @ViewChild('reactionTable',{static:true}) reactionTable: MatTable<any>;
  @ViewChild('medicationTable',{static:true}) medicationTable: MatTable<any>;
  @ViewChild('procedureTable',{static:true}) procedureTable: MatTable<any>;

  httpSubscription;

  // set up default snomed server, also the selected server
  snomedServer = "https://r4.ontoserver.csiro.au/fhir";

  terminologyServers: string[] = [
    "https://primarycare.ontoserver.csiro.au/fhir",
    "https://r4.ontoserver.csiro.au/fhir",
    "https://tx.ontoserver.csiro.au/fhir"
  ];

  selectedMenuItem = "encounter";

  constructor(private httpClient: HttpClient, public dialog: MatDialog, private demoModelService: DemoModelService) {}

  ngOnInit() {

    var storedSnomedServer = JSON.parse(localStorage.getItem('snomedServer'));
    if (storedSnomedServer) {
      this.snomedServer = storedSnomedServer;
    }

  } 
  
  ngOnDestroy() {
    this.httpSubscription.unsubscribe();
  }

  onSnomedServerSelectionChange(event:any)  
  {  
    localStorage.setItem("snomedServer", JSON.stringify(this.snomedServer));
    // reload to do all lookups against a new page
    window.location.reload();
  }  

  sideMenuChanged(item) {
    this.selectedMenuItem = item.value;
  };

  getAlerts() {
    // high criticality alerts
    return this.demoModelService.getReactions('75540009');
  }

  getSex() {
    return this.demoModelService.getSex();
  }

  getGender() {
    return this.demoModelService.getGender();
  }

  getAge(dob: string) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

}
