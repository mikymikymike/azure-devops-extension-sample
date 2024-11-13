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

export class WIT_Bug extends WIT {
//Main left section
   public "Microsoft.VSTS.TCM.ReproSteps": string;
   public "Microsoft.VSTS.CMMI.Symptom": string;
   public "Microsoft.VSTS.TCM.SystemInfo": string;
   public "Microsoft.VSTS.CMMI.ProposedFix": string;
//Planning section
  public "Sogitec.BlockedReason": string;
//Classification section
  public "Microsoft.VSTS.Common.Discipline": string;
  public "Microsoft.VSTS.CMMI.RootCause": string;
//Build section
  public "Microsoft.VSTS.Build.FoundIn": string;
//Effort section
  public "Microsoft.VSTS.Scheduling.CompletedWork": number;
  public "Microsoft.VSTS.Scheduling.RemainingWork": number;
//Hardware section - Tab Sogitec
  public "Sogitec.Manufacturer": string;
  public "Sogitec.Designation": string;
  public "Sogitec.SogitecTag": string;
  public "Sogitec.AdditionalInformation": string;
  public "Sogitec.FirmwareVersion": string;

  public constructor() {
      super();
       this["Microsoft.VSTS.TCM.ReproSteps"]="";
       this["Microsoft.VSTS.CMMI.Symptom"]="";
       this["Microsoft.VSTS.TCM.SystemInfo"]="";
       this["Microsoft.VSTS.CMMI.ProposedFix"]=""; 
       this["Sogitec.BlockedReason"]="";
       this["Microsoft.VSTS.Common.Discipline"]="";
       this["Microsoft.VSTS.CMMI.RootCause"]=""; 
       this["Microsoft.VSTS.Build.FoundIn"]=""; 
       this["Microsoft.VSTS.Scheduling.CompletedWork"]=0; 
       this["Microsoft.VSTS.Scheduling.RemainingWork"]=0; 
       this["Sogitec.Manufacturer"]="";
       this["Sogitec.Designation"]="";
       this["Sogitec.SogitecTag"]="";
       this["Sogitec.AdditionalInformation"]="";
       this["Sogitec.FirmwareVersion"]="";

    }
}