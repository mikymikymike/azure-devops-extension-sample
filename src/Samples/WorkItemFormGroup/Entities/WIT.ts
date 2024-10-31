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

export class WIT
{
    [key: string]: any;

  //main top section
  public "System.AreaPath": string;
  public "System.IterationPath": string;
  public "System.Id": number;
  public "System.AssignedTo": string;
  public "System.Title": string;
  public "System.State" : string;
  public "System.Reason" : string;
  //Planning section
  public "Microsoft.VSTS.Common.Severity": string;
  public "Microsoft.VSTS.Common.Triage": string;
  public "Microsoft.VSTS.Common.Priority" : number;
  //Effort section
  public "Microsoft.VSTS.Scheduling.OriginalEstimate": number;
  //Detection section
  public "Sogitec.Phase": string;
  public "Sogitec.Occurence": string;
  public "Sogitec.Version": string;
  //Build section
  public "Sogitec.IntegratedInBuilds": string;
  //TAB SOGITEC 
  public "Sogitec.Baselines": string;
  public "Sogitec.Collections": string;
  public "Sogitec.PartNumber": string;
  public "Sogitec.SerialNumber": string;
  public "Sogitec.BusinessApplicability": string;
  public "Sogitec.SystemApplicability": string;
  public "Sogitec.ConfigurationApplicability": string;

  public constructor() {
    this["System.AreaPath"] = "";
    this["System.IterationPath"] = "";
    this["System.Id"] = -1;
    this["System.AssignedTo"] = "";
    this["System.Title"] = "";
    this["System.State"] = "Proposed";
    this["System.Reason"] = "New";
    this["Microsoft.VSTS.Common.Severity"] = "";
    this["Microsoft.VSTS.Common.Triage"] = "";
    this["Microsoft.VSTS.Common.Priority"] = -1;
    this["Microsoft.VSTS.Scheduling.OriginalEstimate"] = 0; //can be null
    this["Sogitec.Phase"]="";
    this["Sogitec.Version"] = "";
    this["Sogitec.Occurence"]="";
    this["Sogitec.IntegratedInBuilds"] = "";
    this["Microsoft.VSTS.Build.IntegrationBuild"]=""; 
    this["Sogitec.Baselines"] = "";
    this["Sogitec.Collections"] = "";
    this["Sogitec.PartNumber"] = "";
    this["Sogitec.SerialNumber"] = "";
    this["Sogitec.BusinessApplicability"] = "";
    this["Sogitec.SystemApplicability"] = "";
    this["Sogitec.ConfigurationApplicability"] = "";
  }
 
  protected JSONPathDocumentForCreate():object{    
    var ops:string[] = new Array( Object.keys(this).length); 
    Object.keys(this).forEach((element,index) => {
    ops[index] = `{ "op": "add", "path": "/fields/${element}","from": null,"value": ${JSON.stringify(this[element].toString())} }` //attributes contient un sous json dou le json.stringify
    });
    console.log(ops);
    return(JSON.parse("["+ ops.join(",") + "]"))
  }
}