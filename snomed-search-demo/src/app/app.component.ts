import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValueSet, CodeSystem } from 'fhir-stu3';
import { DialogReactionComponent} from './dialogs/reaction/dialog-reaction.component';
import { MatDialog, MatTable } from '@angular/material';
import { DialogVaccinationComponent } from './dialogs/vaccination/dialog-vaccination.component';
import { DialogProblemComponent } from './dialogs/problem/dialog-problem.component';
import { DialogMedicationComponent } from './dialogs/medication/dialog-medication.component';
import { DialogInvestigationComponent } from './dialogs/investigation/dialog-investigation.component';
import { DialogProcedureComponent } from './dialogs/procedure/dialog-procedure.component';
import { Procedure, DemoModelService } from './demo-model.service';

// export interface Medication {
//   name: string;
//   strength: string;
//   form: string;
//   route: string;
//   freq: string;
//   duration: string;
//   instruction: string;
//   clinicalIndication: string;
//   comment: string;
// }

// export interface Reaction {
//   substance: string;
//   criticality: string;
//   manifestations: string; 
//   verificationStatus: string; 
//   comment: string;
// }

// export interface Vaccination {
//   name: string;
//   brandName: string;
//   substance: string;
//   date: string;
// }

// export interface Problem {
//   name: string;
//   date: string;
// }

// export interface Investigation {
//   test: string;
//   date: string;
//   result: string;
// }

// export interface Procedure {
//   name: string;
//   date: string;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('problemTable', {static:true}) problemTable: MatTable<any>;
  @ViewChild('vaccinationTable', {static:true}) vaccinationTable: MatTable<any>;
  @ViewChild('investigationTable', {static:true}) investigationTable: MatTable<any>;
  @ViewChild('reactionTable',{static:true}) reactionTable: MatTable<any>;
  @ViewChild('medicationTable',{static:true}) medicationTable: MatTable<any>;
  @ViewChild('procedureTable',{static:true}) procedureTable: MatTable<any>;

  httpSubscription;

  // set up default snomed server, also the selected server
  snomedServer = "https://snowstorm-fhir.snomedtools.org/fhir";

  terminologyServers: string[] = [
    "https://snowstorm-fhir.snomedtools.org/fhir",
    "https://r4.ontoserver.csiro.au/fhir"
  ];

  selectedMenuItem = "encounter";

  sexValues = [];

  // // allergies / adverse reactions
  // reactionData: Reaction[] = [
  //   {substance: '764146007', criticality: '75540009', manifestations: '271807003', verificationStatus: 'confirmed', comment: 'childhood'},
  // ];
  // displayedReactionColumns : string[] = ['substance', 'criticality', 'manifestations', 'verificationStatus', 'comment'];
  // reactionDataSource = this.reactionData;

  // // medication
  // medicationData: Medication[] = [
  //   {name: 'ventolin', strength: '100 microgram', form: 'inhaler', route: 'oral', freq: 'twice daily', duration: 'ongoing', instruction: 'as required', clinicalIndication: 'asthma', comment: ''},
  // ];
  // displayedMedicationColumns: string[] = ['name', 'strength', 'form', 'route', 'freq', 'duration', 'instruction', 'clinicalIndication', 'comment'];
  // medicationDataSource = this.medicationData;

  // // problems
  // problemData: Problem[] = [
  //   {name: 'asthma', date: '1990-08-08'},
  // ];
  // displayedProblemColumns: string[] = ['name', 'date'];
  // problemDataSource = this.problemData;  

  // // vaccinations
  // vaccinationData: Vaccination[] = [
  //   {name: 'HEP-B', brandName: '', substance: '', date: '2019-08-21'},
  // ];
  // displayedVaccinationColumns: string[] = ['name', 'brandName', 'substance', 'date'];
  // vaccinationDataSource = this.vaccinationData;

  // // investigations
  // investigationData: Investigation[] = [
  //   {test: 'Cholesterol', date: '2019-08-22', result: '20'}
  // ];
  // displayedInvestigationColumns: string[] = ['test', 'date', 'result'];
  // investigationDataSource = this.investigationData;

  // // procedures
  // procedureData: Procedure[] = [
  //   {code: 'XXX', codeDisplay: 'Appendectomy', date: '2010-06-04'}
  // ];
  // displayedProcedureColumns: string[] = ['name', 'date'];
  // procedureDataSource = this.procedureData;

  snomedConceptCache = {};

  constructor(private httpClient: HttpClient, public dialog: MatDialog, private demoModelService: DemoModelService) {}

  ngOnInit() {

    var storedSnomedServer = JSON.parse(localStorage.getItem('snomedServer'));
    if (storedSnomedServer) {
      this.snomedServer = storedSnomedServer;
    }

    const url = this.snomedServer + '/ValueSet/$expand?_format=json&url=http:%2F%2Fsnomed.info%2Fsct?fhir_vs=isa%2F429019009';
  
    this.httpSubscription = this.httpClient.get<ValueSet>(url)
      .subscribe(result => {
        result.expansion.contains.forEach(val => {
          this.sexValues.push({value: val.code, display: val.display});
        })
      });
  } 
  
  ngOnDestroy() {
    this.httpSubscription.unsubscribe();
  }

  onSnomedServerSelectionChange(event:any)  
  {  
    console.log("changing to ", this.snomedServer);
    localStorage.setItem("snomedServer", JSON.stringify(this.snomedServer));
    // reload to do all lookups against a new page
    window.location.reload();
  }  

  sideMenuChanged(item) {
    console.log("Selected value: " + item.value);

    this.selectedMenuItem = item.value;
  };

  getAlerts() {
    // high criticality alerts
    return this.demoModelService.getReactions('75540009');
  }

  // lookupSnomedDesc(code : string) {

  //   var description = "";

  //   if (code) {
  //     console.log("looking up description for =", code);
  //     description = this.snomedConceptCache[code];
  // //console.log("description", description);
  //     if (!description) {
  //       //console.log("nothing found in cache for '" + code + '"');
  //       //console.log("cache is ", this.snomedConceptCache);
  //       //console.log("keys=" + Object.keys(this.snomedConceptCache));
  //       // cache miss, lookup server
  //       var lookupSubscription = this.httpClient.get<CodeSystem>(this.snomedServer + '/CodeSystem/$lookup?system=http://snomed.info/sct&code=' + code)
  //         .subscribe(result => {
  //           //console.log("result=", result);
  //           for (let entry of result['parameter']) {
  //             if (entry['name'] === 'display') {
  //               //console.log("RESULT! entry['valueString']", entry['valueString']);
  //               this.snomedConceptCache[code] = entry['valueString'];
  //               //console.log("this.snomedConceptCache", this.snomedConceptCache);
  //               break;
  //             }
  //           }
  //           if (!(code in this.snomedConceptCache)) {
  //             this.snomedConceptCache[code] = "unknown";
  //           }
  //           lookupSubscription.unsubscribe();
  //           return this.snomedConceptCache[code];
  //         });
  //         return lookupSubscription;
  //     }

  //   }
  //   return description;

  // }

//   getSexValues() {
//     return this.sexValues;
//   }

//   handleDialogClose(dialogRef, tableSource, table) {

//     dialogRef.afterClosed().subscribe(result => {

//       if (result.event === "save") {
// //console.log("result.data", result.data);
//         // for now, strip out the object. Perhaps the table can be changed to process the object in the future and
//         // eliminate the need for a code lookup
//         Object.keys(result.data).forEach(function(key) {
//           if (typeof result.data[key] === 'object') { 
//             result.data[key] = result.data[key]['display'] 
//           }
//         });

//         tableSource.push(result.data);
//         table.renderRows();
//       }

//     });
//   }

  // openReactionDialog() {

  //   const dialogRef = this.dialog.open(DialogReactionComponent, {
  //     width: '500px',
  //     // height: '1000px',
  //     data: {'snomedServer': this.snomedServer},
  //   });

  //   this.handleDialogClose(dialogRef, this.reactionData, this.reactionTable);

  // }

  // openVaccinationDialog() {

  //   const dialogRef = this.dialog.open(DialogVaccinationComponent, {
  //     data: {},
  //   });

 
  //   this.handleDialogClose(dialogRef, this.vaccinationData, this.vaccinationTable);
  // }

  // openProblemDialog() {

  //   const dialogRef = this.dialog.open(DialogProblemComponent, {
  //     data: {},
  //   });


  //   this.handleDialogClose(dialogRef, this.problemData, this.problemTable);
  // }

  // openMedicationDialog() {

  //   const dialogRef = this.dialog.open(DialogMedicationComponent, {
  //     data: {},
  //   });


  //   this.handleDialogClose(dialogRef, this.medicationData, this.medicationTable);
  // }

  // openInvestigationDialog() {

  //   const dialogRef = this.dialog.open(DialogInvestigationComponent, {
  //     data: {},
  //   });


  //   this.handleDialogClose(dialogRef, this.investigationData, this.investigationTable);
  // }

  // openProcedureDialog() {

  //   const dialogRef = this.dialog.open(DialogProcedureComponent, {
  //     data: {},
  //   });


  //   this.handleDialogClose(dialogRef, this.procedureData, this.procedureTable);    
  // }

  // openBloodGroupDialog() {

  // }


  // openPhysicalDialog() {

  // }

  // openDiagnosisDialog() {

  // }
}
