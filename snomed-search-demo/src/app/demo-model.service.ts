import { Injectable } from '@angular/core';

export interface SnomedConcept {
  value: string;
  display: string;
}

export interface Encounter {

}

export interface Medication {
  name: string;
  strength: string;
  form: string;
  route: string;
  freq: string;
  duration: string;
  instruction: string;
  clinicalIndication: string;
  comment: string;
}

export interface Reaction {
  substanceCode: string;
  substanceDisplay: string;
  criticalityCode: string;
  criticalityDisplay: string;
  manifestations;
  verificationStatus: string; 
  comment: string;
}

export interface DiagnosticImagingInvestigation {
  presentingProblemCode: string;
  presentingProblemDisplay: string;
  serviceRequestCode: string;
  serviceRequestDisplay: string;
  contrastMaterialCode: string;
  contrastMaterialDisplay: string;
  additionalNotes: string;
}

export interface Vaccination {
  name: string;
  brandName: string;
  substance: string;
  date: string;
}

export interface Problem {
  code: string;
  codeDisplay: string;
  date: string;
}

export interface PathologyInvestigation {
  test: string;
  date: string;
  result: string;
}

export interface Procedure {
  code: string;
  codeDisplay: string;
  date: string;
}

export interface FamilyHistory {
  relationshipCode: string;
  relationshipDisplay: string;
  problemCode: string;
  problemDisplay: string;
  onsetAge: number;
  deceasedAge: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemoModelService {

  reactions: Reaction[] = [
    {substanceCode: '764146007', substanceDisplay: 'Penicillin', criticalityCode: '75540009', criticalityDisplay: 'High', manifestations : [{value: '271807003', display: 'Rash'}], verificationStatus: 'confirmed', comment: 'childhood'},
  ];

  diagnosticImagingInvestigations: DiagnosticImagingInvestigation[] = [
    {presentingProblemCode: '30561011000036101', presentingProblemDisplay: 'Chronic cough', serviceRequestCode: '399208008', serviceRequestDisplay: 'Plain chest X-ray', contrastMaterialCode : '', contrastMaterialDisplay: '', additionalNotes: 'cough since April. Hx of travel SE Asia'},
  ]

  procedures: Procedure[] = [
    {code: '80146002', codeDisplay: 'Appendectomy', date: '2010-06-04'}
  ];

  problems: Problem[] = [
    {code: '195967001', codeDisplay: 'Asthma', date: '1990-08-08'},
  ];

  encounters: Encounter[] = [
  ];

  familyHistory: FamilyHistory[] = [
    {relationshipCode: '66839005', relationshipDisplay: 'Father', problemCode: '363418001', problemDisplay: 'Malignant tumour of pancreas', onsetAge: 72, deceasedAge: 72}
  ];

  sex: SnomedConcept = {display:'Male',value: '248153007'};
  gender: SnomedConcept = {display:'Male', value: '248153007'};

  constructor() { }

  getSex() : SnomedConcept {
    return this.sex;
  }

  setSex(sex : SnomedConcept) {
    this.sex = sex;
  }

  getGender() : SnomedConcept {
    return this.gender;
  }

  setGender(gender : SnomedConcept) {
    this.gender = gender;
  }

  getEncounters() : Encounter[] {

    return this.encounters;

  }

  addEncounter(rfeCode: string, rfeDisplay: string, procCode: string, procDisplay: string, 
    diagCode: string, diagDisplay: string, diagNote: string, latCode: string, latDisplay: string, enctrNote: string) {

    this.encounters.unshift(
      {
        reasonForEncounterCode: rfeCode, reasonForEncounterDisplay: rfeDisplay,
        procedureCode: procCode, procedureDisplay: procDisplay,
        diagnosisCode: diagCode, diagnosisDisplay: diagDisplay,
        diagnosisNote: diagNote,
        lateralityCode: latCode, lateralityDisplay: latDisplay,
        encounterNote: enctrNote
      }
    );
  }

  getReactions(criticalityCode: string) : Reaction[] {

    if (!criticalityCode) {
      return this.reactions;
    }

    var filteredReactions : Reaction[] = [];
    this.reactions.forEach(function(reaction) {
      if (reaction.criticalityCode === criticalityCode) {
        filteredReactions.push(reaction);
      }
    })

    return filteredReactions;
  }

  addReaction(
    subCode : string, 
    subDisplay: string, 
    critCode: string, 
    critDisplay: string, 
    manifestationsList,
    verStatus: string, 
    cmt: string) {
    
    this.reactions.push(
      {substanceCode: subCode, substanceDisplay: subDisplay, 
      criticalityCode: critCode, criticalityDisplay: critDisplay, 
      manifestations: manifestationsList,
      verificationStatus: verStatus, 
      comment: cmt}
    )

  }

  getDiagnosticImagingInvestigations() : DiagnosticImagingInvestigation[] {

    return this.diagnosticImagingInvestigations;
  }

  addDiagnosticImagingInvestigation(
    presentingProblemCode: string,
    presentingProblemDisplay: string,
    serviceRequestCode: string,
    serviceRequestDisplay: string,
    contrastMaterialCode: string,
    contrastMaterialDisplay: string,
    additionalNotes: string) {
      
    this.diagnosticImagingInvestigations.push(
      {presentingProblemCode: presentingProblemCode, presentingProblemDisplay: presentingProblemDisplay,
      serviceRequestCode: serviceRequestCode, serviceRequestDisplay: serviceRequestDisplay,
      contrastMaterialCode: contrastMaterialCode, contrastMaterialDisplay: contrastMaterialDisplay,
      additionalNotes: additionalNotes

      }
    )
  }

  getProcedures() : Procedure[] {
    return this.procedures;
  }

  addProcedure(procCode, procDisplay: string, procDate: string) {
    this.procedures.push({code: procCode, codeDisplay: procDisplay, date: procDate});
  }

  getProblems() : Problem[] {
    return this.problems;
  }

  addProblem(problemCode : string, problemDisplay: string, problemDate: string) {
    this.problems.push({code: problemCode, codeDisplay: problemDisplay, date: problemDate});
  }

  getFamilyHistory() : FamilyHistory[] {
    return this.familyHistory;
  }

  addFamilyHistory(relationshipCode: string, relationshipDisplay: string, problemCode: string, problemDisplay: string, onsetAge: number, deceasedAge: number) {
    this.familyHistory.push({relationshipCode: relationshipCode, relationshipDisplay: relationshipDisplay, problemCode: problemCode, problemDisplay: problemDisplay,
      onsetAge: onsetAge, deceasedAge: deceasedAge});
  }
}
