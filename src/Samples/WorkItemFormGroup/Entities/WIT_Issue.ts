//Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment. 
//THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, 
//INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE. 
//We grant You a nonexclusive, royalty-free right to use and modify 
//the Sample Code and to reproduce and distribute the object code form of the Sample Code, provided that. 
//You agree: (i) to not use Our name, logo, or trademarks to market 
//Your software product in which the Sample Code is embedded; 
//(ii) to include a valid copyright notice on Your software product in which the Sample Code is embedded; 
//and (iii) to indemnify, hold harmless, and defend Us and Our suppliers from and against any claims or lawsuits, 
//including attorneys’ fees, that arise or result from the use or distribution of the Sample Code

import {WIT} from "./WIT";
import { CustomValues } from "../../Utils/Utils";

import {WIT_Bug} from "./WIT_Bug";

export class WIT_Issue extends WIT  {
//main left section
  public "System.Description": string;
  public "Microsoft.VSTS.CMMI.Analysis": string;
  public "Microsoft.VSTS.CMMI.CorrectiveActionActualResolution": string;
//Classification
  public "Sogitec.FixedSimulatorVersion": string;
//Analysis section
  public "Sogitec.ResolvedPriority": number;


  public constructor() {
    super();
     this["System.Description"]="";
     this["Microsoft.VSTS.CMMI.Analysis"]="";
     this["Microsoft.VSTS.CMMI.CorrectiveActionActualResolution"]="";
     this["Sogitec.ResolvedPriority"]=-1;
    }
  
  public MapAndGetJSONdocPathDocument(witBug:WIT_Bug, customValues:CustomValues):object{    
    //mapping one to one for native fields
    this["System.AreaPath"] = witBug["System.AreaPath"]
    this["System.IterationPath"] = witBug["System.IterationPath"]
    this["System.Id"] = witBug["System.Id"]
    this["System.AssignedTo"] = witBug["System.AssignedTo"]
    this["System.Title"] = witBug["System.Title"]
    this["Microsoft.VSTS.Common.Severity"] = witBug["Microsoft.VSTS.Common.Severity"]
    this["Microsoft.VSTS.Common.Triage"] = witBug["Microsoft.VSTS.Common.Triage"]
    this["Microsoft.VSTS.Common.Priority"] = witBug["Microsoft.VSTS.Common.Priority"]
    this["Microsoft.VSTS.CMMI.Blocked"] = witBug["Microsoft.VSTS.CMMI.Blocked"]
    
    
    //mapping one to one for custom fields
    this["Sogitec.ResolvedPriority"] = witBug["Microsoft.VSTS.Common.Priority"]
    this["Sogitec.Occurence"]=witBug["Sogitec.Occurence"]
    this["Sogitec.Baselines"]=witBug["Sogitec.Baselines"]
    this["Sogitec.Collections"]=witBug["Sogitec.Collections"]
    this["Sogitec.PartNumber"]=witBug["Sogitec.PartNumber"]
    this["Sogitec.SerialNumber"]=witBug["Sogitec.SerialNumber"]
    this["Sogitec.BusinessApplicability"]=witBug["Sogitec.BusinessApplicability"]
    this["Sogitec.SystemApplicability"]=witBug["Sogitec.SystemApplicability"]
    this["Sogitec.ConfigurationApplicability"]=witBug["Sogitec.ConfigurationApplicability"]
    this["Sogitec.IntegratedInBuilds"]= witBug["Sogitec.IntegratedInBuilds"]
    
    //get values from popup
    this["Sogitec.Version"] = customValues.workItemVersion
    this["Sogitec.Site"] = customValues.workItemSite
    this["Sogitec.Phase"] = customValues.workItemPhase

    
    //Original estimate : this field cannot be null otherwise it generates an error. Don't know why. 
    if (witBug["Microsoft.VSTS.Scheduling.OriginalEstimate"] !== undefined && witBug["Microsoft.VSTS.Scheduling.OriginalEstimate"] !== null)     {
      this["Microsoft.VSTS.Scheduling.OriginalEstimate"] = witBug["Microsoft.VSTS.Scheduling.OriginalEstimate"];
    }
  
    // Description Field
    this["System.Description"] = "<br/><br/>"
    if (witBug["Microsoft.VSTS.TCM.ReproSteps"]!=="")
    {
      this["System.Description"] += `<b><u> Repro Steps: </b></u><br/> ${witBug["Microsoft.VSTS.TCM.ReproSteps"]}<br/>` 
    }
    if (witBug["Microsoft.VSTS.CMMI.Symptom"]!=="")
    {
      this["System.Description"] += `<b><u> Symptom: </b></u><br/> ${witBug["Microsoft.VSTS.CMMI.Symptom"]}<br/>`
    }
    if (witBug["Microsoft.VSTS.TCM.SystemInfo"]!=="")
    {
      this["System.Description"] += `<b><u> System Info: </b></u><br/> ${witBug["Microsoft.VSTS.TCM.SystemInfo"]}<br/>` 
    }
    if (witBug["Sogitec.Manufacturer"]!=="")
    {
      this["System.Description"] += `<b><u> Hardware - Manufacturer: </b></u><br/> ${witBug["Sogitec.Manufacturer"]}<br/>` 
    }
    if (witBug["Sogitec.Designation"]!=="")
    {
      this["System.Description"] += `<b><u> Hardware - Designation: </b></u><br/> ${witBug["Sogitec.Designation"]}<br/>` 
    }
    if (witBug["Sogitec.SogitecTag"]!=="")
    {
      this["System.Description"] += `<b><u> Hardware - Sogitec Tag: </b></u><br/> ${witBug["Sogitec.SogitecTag"]}<br/>` 
    }
    if (witBug["Sogitec.AdditionalInformation"]!=="")
    {
      this["System.Description"] += `<b><u> Hardware - Additional Information: </b></u><br/> ${witBug["Sogitec.AdditionalInformation"]}<br/>` 
    }
    if (witBug["Sogitec.FirmwareVersion"]!=="")
    {
      this["System.Description"] += `<b><u> Hardware - Firmware Version: </b></u><br/> ${witBug["Sogitec.FirmwareVersion"]}<br/>` 
    }

    //Analysis Field
    //this["Microsoft.VSTS.CMMI.Analysis"] = `<b><u> Blocked: </b></u><br/> ${witBug["Microsoft.VSTS.CMMI.Blocked"]}<br/>`
    this["Microsoft.VSTS.CMMI.Analysis"] = ""
      
    if (witBug["Sogitec.BlockedReason"]!== "")
    {
      this["Microsoft.VSTS.CMMI.Analysis"] += `<b><u> Blocked Reason: </b></u><br/> ${witBug["Sogitec.BlockedReason"]}<br/>` 
    }
    if (witBug["Microsoft.VSTS.Common.Discipline"]!== "")
    {
      this["Microsoft.VSTS.CMMI.Analysis"] += `<b><u> Classification - Discipline: </b></u><br/> ${witBug["Microsoft.VSTS.Common.Discipline"]}<br/>` 
    }
    this["Microsoft.VSTS.CMMI.Analysis"] +=  `<b><u> Classification - Root Cause: </b></u><br/> ${witBug["Microsoft.VSTS.CMMI.RootCause"]}<br/>` 
    if (witBug["Microsoft.VSTS.Build.FoundIn"] !=="")
    {
      this["Microsoft.VSTS.CMMI.Analysis"] += `<b><u> Build - Found In (impacted component version): </b></u><br/> ${witBug["Microsoft.VSTS.Build.FoundIn"]}<br/>`
    }
    //Corrective Action Plan Field
    if(witBug["Microsoft.VSTS.CMMI.ProposedFix"] !="")
    {
      this["Microsoft.VSTS.CMMI.CorrectiveActionActualResolution"] = `<b><u> Proposed Fix: </b></u><br/> ${witBug["Microsoft.VSTS.CMMI.ProposedFix"]}<br/>` 
    } 
    if (witBug["Microsoft.VSTS.Scheduling.CompletedWork"] !== undefined && witBug["Microsoft.VSTS.Scheduling.CompletedWork"] !== null)     
    {
      this["Microsoft.VSTS.CMMI.CorrectiveActionActualResolution"] += `<b><u> Completed Work: </b></u><br/> ${witBug["Microsoft.VSTS.Scheduling.CompletedWork"]}<br/>` 
    }
    if (witBug["Microsoft.VSTS.Scheduling.RemainingWork"] !== undefined && witBug["Microsoft.VSTS.Scheduling.RemainingWork"] !== null)     
    {
      this["Microsoft.VSTS.CMMI.CorrectiveActionActualResolution"] += `<b><u> Remaining Work: </b></u><br/> ${witBug["Microsoft.VSTS.Scheduling.RemainingWork"]}<br/>` 
    }
      

      //console.log("integrated in builds" + witBug["Sogitec.IntegratedInBuilds"])
      //console.log( customValues.workItemPhase)
      //console.log( customValues.workItemSite)
      //console.log( customValues.workItemVersion)
      // console.log(    witBug["System.AreaPath"])
      // console.log(    witBug["System.IterationPath"])
      // console.log(    witBug["System.Id"])
      // console.log(    witBug["System.AssignedTo"])
      // console.log(    witBug["System.Title"])
      // console.log(    witBug["System.State"])
      // console.log(    witBug["System.Reason"])
      // console.log(    witBug["Microsoft.VSTS.Common.Severity"])
      // console.log(    witBug["Microsoft.VSTS.Common.Triage"])
      //  console.log(    witBug["Microsoft.VSTS.Scheduling.OriginalEstimate"])
      //  console.log(    witBug["Microsoft.VSTS.Scheduling.CompletedWork"])
      //  console.log(    witBug["Microsoft.VSTS.Scheduling.RemainingWork"])
      //  console.log(    witBug["Microsoft.VSTS.Build.IntegrationBuild"])
      // console.log(    this["Microsoft.VSTS.Scheduling.OriginalEstimate"])
      //  console.log(    witBug["Sogitec.Phase"])
      //  console.log(    witBug["Sogitec.Site"])
      // console.log(    witBug["Sogitec.Occurence"])
      // console.log(    witBug["Sogitec.Baselines"])
      // console.log(    witBug["Sogitec.Collections"])
      // console.log(    witBug["Sogitec.PartNumber"])
      // console.log(    witBug["Sogitec.SerialNumber"])
      // console.log(    witBug["Sogitec.BusinessApplicability"])
      // console.log(    witBug["Sogitec.SystemApplicability"])
      // console.log( witBug["Microsoft.VSTS.TCM.ReproSteps"])
      // console.log(witBug["Microsoft.VSTS.CMMI.Symptom"])
      // console.log(       witBug["Microsoft.VSTS.TCM.SystemInfo"])
      // console.log(       witBug["Microsoft.VSTS.CMMI.ProposedFix"]) 
      // console.log(       witBug["Microsoft.VSTS.Common.Priority"])
      // console.log(       witBug["Microsoft.VSTS.CMMI.Blocked"]) 
      // console.log(       witBug["Sogitec.BlockedReason"])
      // console.log(       witBug["Microsoft.VSTS.Common.Discipline"])
      // console.log(       witBug["Microsoft.VSTS.CMMI.RootCause"]) 
      // console.log(       witBug["Microsoft.VSTS.Build.FoundIn"])
      // console.log(       witBug["Microsoft.VSTS.Build.IntegrationBuild"])   
      // console.log(this["System.Description"]);
      // console.log(this["Microsoft.VSTS.CMMI.Analysis"]);
      // console.log(this["Microsoft.VSTS.CMMI.CorrectiveActionActualResolution"]);
     //  console.log(this["Sogitec.Version"]);
      // console.log(this["Sogitec.FixedSimulatorVersion"]);
      // console.log(this["Sogitec.ResolvedPriority"]);
      //console.log(this["Sogitec.IntegratedInBuilds"]);
      return this.JSONPathDocumentForCreate();
    
  }
}