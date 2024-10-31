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

"use strict";
import {
  IWorkItemChangedArgs,
  IWorkItemFieldChangedArgs,
  IWorkItemFormService,
  IWorkItemLoadedArgs,
  WorkItemTrackingServiceIds,
  WorkItemOptions,
  WorkItemTrackingRestClient,
  WorkItemRelation,
  WorkItem,
  WorkItemExpand
} from "azure-devops-extension-api/WorkItemTracking";

import {WIT_Issue} from "./Entities/WIT_Issue";
import {WIT_Bug} from "./Entities/WIT_Bug";
import {CommonServiceIds, getClient, IProjectPageService, IHostPageLayoutService,IHostNavigationService  } from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";
import { Button } from "azure-devops-ui/Button";
import * as React from "react";
import { showRootComponent } from "../../Common";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import {CustomValues} from "../Utils/Utils";
var returnDialogBox = false;

interface WorkItemFormGroupComponentState {
  eventContent: string;
}


export class monOpt implements WorkItemOptions
{
  returnOriginalValue: boolean = false;
}


/*
  Returns a string which represent the JSONPatchDocument used to add a link to a WIT
*/
/*
  the existing relation return  "System.LinkTypes.Related-Forward" 
  but accept "System.LinkTypes.Related" to create the same link. 
  So we need to transform "System.LinkTypes.Related-Forward"  $or "System.LinkTypes.Related-Reverse" to "System.LinkTypes.Related"
*/
function GetRefNameRelation(rel:string):string{

  var result:string=rel;
  switch(result) { 
    case "System.LinkTypes.Related-Forward": 
    case "System.LinkTypes.Related-Reverse":
    { 
       result = "System.LinkTypes.Related"; 
       break; 
    } 
    default: { 
       //statements; 
       break; 
    } 
 } 

  return result;
}
 //nous dit si l'ID d'un WI est un Requirement ou pas.
 //const client = getClient(WorkItemTrackingRestClient);
 //var wit = await client.getWorkItem(id,project,["System.WorkItemType"]);
 //console.log("result isWorkItemTYpe AFF NH90 : " + wit.fields["System.WorkItemType"]);
 //console.log("result isWorkItemTYpe AFF NH90 : " + wit.fields["System.WorkItemType"]=="Requirement");

/*
  Returns a string which represent the JSONPatchDocument used to add a link to a WIT
*/
function GetJson_WIT_AddRelationShip(rel:object):string {
  var ops:string[] = new Array( Object.entries(rel).length); 
  var refNameRelation:string;
  Object.entries(rel).forEach((value,index) => {
  var element =JSON.parse(JSON.stringify(value[1]));
  refNameRelation=GetRefNameRelation(element["rel"]);      
      ops[index] = `{"op": "add","path": "/relations/-","value": {"rel": "${refNameRelation}", "url": "${element["url"]}","attributes": ${JSON.stringify(element["attributes"])}}}` //attributes contient un sous json dou le json.stringify
  });
  return("["+ ops.join(",") + "]")
}

 
export class WorkItemFormGroupComponent extends React.Component<{},  WorkItemFormGroupComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      eventContent: ""
    };
  }
  private customValues = new CustomValues("&","&","&");
  
  public componentDidMount() {
    SDK.init().then(() => {
       this.registerEvents();
     });
  }

  public render(): JSX.Element {
    return (
      <div>
        <div className="sample-work-item-button"> 
        <Button
        id = "createWIT"
          
          text="Convert to Issue"
          onClick={() => this.onClick()}
        />
        </div>
        <div className="sample-work-item-events">{this.state.eventContent}</div>

        <div className="flex-row" >

            <div style={{ marginLeft: 4 }} />
            <Spinner size={SpinnerSize.large} />
            </div>
      </div>
    );
  }

  private registerEvents() {
    SDK.register(SDK.getContributionId(), () => {
      return {
        // Called when the active work item is modified
        onFieldChanged: (args: IWorkItemFieldChangedArgs) => {
          // this.setState({
          //   eventContent: `onFieldChanged - ${JSON.stringify(args)}`
          // });
        },

        // Called when a new work item is being loaded in the UI
        onLoaded: (args: IWorkItemLoadedArgs) => {

         const workItemLoadedInfo : IWorkItemLoadedArgs = args;
          if (workItemLoadedInfo.isNew)
          {
            this.ActivateButtonCreateWIT(true);
            //(document.getElementById('__bolt-createWIT') as HTMLButtonElement).disabled = true;
          }
          this.ShowSpinner(false);
          // this.setState({
          //   eventContent: `onLoaded - ${JSON.stringify(args)}`
         
          // });
        },

        // Called when the active work item is being unloaded in the UI
        onUnloaded: (args: IWorkItemChangedArgs) => {
          // this.setState({
          //   eventContent: `onUnloaded - ${JSON.stringify(args)}`
          // });
        },

        // Called after the work item has been saved
        onSaved: (args: IWorkItemChangedArgs) => {
          this.ActivateButtonCreateWIT(false);
          // this.setState({
          //   eventContent: `onSaved - ${JSON.stringify(args)}`
          // });
        },

        // Called when the work item is reset to its unmodified state (undo)
        onReset: (args: IWorkItemChangedArgs) => {
          // this.setState({
          //   eventContent: `onReset - ${JSON.stringify(args)}`
          // });
        },

        // Called when the work item has been refreshed from the server
        onRefreshed: (args: IWorkItemChangedArgs) => {
          // this.setState({
          //   eventContent: `onRefreshed - ${JSON.stringify(args)}`
          // });
        }
      };
    });
  }

  private ShowSpinner(isVisible:boolean){
    const divElement = document.getElementsByClassName('flex-row');
    let visible:string ="";
    if(isVisible)
    {
      visible="visible";
    }
    else
    {
      visible = "hidden"
    }
    for (let i = 0; i < divElement.length; i++) {
        const slide = divElement[i] as HTMLElement;
        slide.style.visibility = visible;
    }
  }

  private ActivateButtonCreateWIT(isDisabled:boolean){
    const divElement = document.getElementsByClassName('sample-work-item-button');
    for (let i = 0; i < divElement.length; i++) {
       const slide = divElement[i] as  HTMLDivElement;
        slide.hidden = isDisabled
    }

    //(document.getElementById('__bolt-createWIT') as HTMLButtonElement).disabled = true;
  }

  private ShowErrorMessage()
  {
      this.setState({
        eventContent: "Erreur rencontrée."
      });
    this.ShowSpinner(false); 
  }

   private async CreateCopyCurrentWIT(typeWITToCreate:string, customValues:CustomValues) : Promise<string> {
    
    this.ShowSpinner(true); 
    let projectName:string = "";  
    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );

    console.log("CreateCopyCurrentWIT.start")
    console.log("customValues.workItemSite="+customValues.workItemSite)
    console.log("customValues.workItemVersion="+customValues.workItemVersion)
    console.log("customValues.workItemPhase="+customValues.workItemPhase)

    const idCurrentWIT = await workItemFormService.getId();   
    const opt  = new monOpt();
    const client = getClient(WorkItemTrackingRestClient);
    const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
    const project = await projectService.getProject();

    if (project) {
      projectName= project.name;
    } 
    else
    {
      console.error("await projectService.getProject() returns null (custome error message)");
      return Promise.resolve("");
    } 
     
    /*
      Get current infos (fields and Relationship) from current WIT
    */ 
    //Get Fields
      
    let WITBug:WIT_Bug = new WIT_Bug();
    try 
    {
        //await workItemFormService.getFieldValues(["Microsoft.VSTS.TCM.SystemInfo","Microsoft.VSTS.TCM.ReproSteps","Microsoft.VSTS.CMMI.Symptom","System.AssignedTo","System.Title","System.AreaPath","System.IterationPath","System.TeamProject"],opt).then(
        await workItemFormService.getFieldValues(Object.keys(WITBug),opt).then(
          function (value) {
              var objJson = JSON.parse(JSON.stringify(value));
              Object.entries(objJson).forEach(value => {
                WITBug[value[0] as string] = value[1];
                }
              );
          }
        );
    }
    catch(e) {
      this.ShowErrorMessage()
      console.log('await workItemFormService.getFieldValues Error: ', e);
      return Promise.resolve("");
    }
    
    let listRelationToAdd:WorkItemRelation[]  = [];
    let listComplRelations:WorkItemRelation[]  = [];
    let listRelationToRemove:WorkItemRelation[]  = []; //obligation de récupérer 2 listes car l'initiale sera conservée pour être supprimée au niveau du bug. L'autre est potentiellement modifiee s'il y a des liens Parent, qui deviendront des liens Related.

    try 
    {
        //Get relationships
        await workItemFormService.getWorkItemRelations().then(
          function (rel) {
            if (rel){
              listRelationToAdd = JSON.parse(JSON.stringify(rel)); // parse & stringify = copie de la liste pour modification
              listRelationToRemove = rel; //recuperation de la liste initiale. non modifiee pour suppression de ces liens au niveau du bug
              
              Object.entries(listRelationToAdd).forEach(([key, value]) => {     
                //var WI_id = element["url"].substring(element["url"].lastIndexOf('/') + 1); // get the linked work item number

                //Version 1 : si lien est de type Parent, alors je le converti en Related
                switch(value["rel"]) { 
                    case "System.LinkTypes.Hierarchy-Reverse":
                    { 
                      value["rel"] = "System.LinkTypes.Related"; 
                      break; 
                    }
                    /*case "Microsoft.VSTS.Common.TestedBy-Forward":
                    { 
                      console.log("link 'Tested-By' found")
                      var WI_id = value["url"].substring(value["url"].lastIndexOf('/') + 1);
                      var id = parseInt(WI_id)
                      console.log("link to " + WI_id)
                      let wi = client.getWorkItem(id).then(
                        function (wi) {
                          console.log("relations")
                          console.log("-:" + wi.relations)
                        }
                      )
                    } */
                    default: 
                    { 
                      //statements; 
                      break; 
                    } 
                }
              });

            } 
          }
        );       
    } catch(e) {
      console.log('await workItemFormService.getWorkItemRelations Error: ', e);
      this.ShowErrorMessage()
      return Promise.resolve("");
    }

    try{
      for (var i = 0; i < listRelationToAdd.length; i++) {
        console.log("rel:" + listRelationToAdd[i]);
        let value = listRelationToAdd[i]
        //var WI_id = element["url"].substring(element["url"].lastIndexOf('/') + 1); // get the linked work item number

        //Version 1 : si lien est de type Parent, alors je le converti en Related
        switch(value["rel"]) { 
            case "System.LinkTypes.Hierarchy-Reverse":
            { 
              value["rel"] = "System.LinkTypes.Related"; 
              break; 
            }
            case "Microsoft.VSTS.Common.TestedBy-Forward":
            { 
              console.log("link 'Tested-By' found")
              var WI_id = value["url"].substring(value["url"].lastIndexOf('/') + 1);
              var id = parseInt(WI_id)
              console.log("link to " + WI_id)

              await client.getWorkItem(id, expand:WorkItemExpand.All).then(
                function (wi) {
                  console.log("wi:"+id)
                  console.log("relations:" + wi.relations)
                }
              )

              //client.getre
            } 
            default: 
            { 
              //statements; 
              break; 
            } 
        }
      }
    } catch(e) {
      console.log('await workItemFormService.getWorkItemRelations Error: ', e);
      this.ShowErrorMessage()
      return Promise.resolve("");
    }

    console.log("end links")

    let urlNewWIT : string="";
    let idNewWIT : number ;
    try
    {
      let WITIssue = new WIT_Issue();
      const newWIT = await client.createWorkItem(WITIssue.MapAndGetJSONdocPathDocument(WITBug,customValues), projectName,typeWITToCreate);
      const objNewWIT = JSON.parse(JSON.stringify(newWIT));
      idNewWIT = objNewWIT["id"]; 
      urlNewWIT = objNewWIT["_links"]["html"]["href"];

    }
    catch(e) {
      console.log('await client.createWorkItem Error:', e);
      this.ShowErrorMessage()
      return Promise.resolve("");;
    }  
    /*
    Recreate relations if needed
    */
    if (listRelationToRemove.length > 0 && listRelationToAdd.length > 0 )
    {
        try
        {
          /* 
          Delete existing link
          */
          await workItemFormService.removeWorkItemRelations(listRelationToRemove);
          await workItemFormService.save();
        }
        catch(e) {
          console.log('await workItemFormService.removeWorkItemRelations and save action Error: ', e);
          this.ShowErrorMessage()
          return Promise.resolve("");
        }
        try
        {
          const obj2 = await client.updateWorkItem(JSON.parse(GetJson_WIT_AddRelationShip(listRelationToAdd)),idNewWIT)
        }
        catch(e) {
          console.log('await client.updateWorkItem Error: ', e);
          this.ShowErrorMessage()
          /* Restore Link to the previous WIT if error*/
          await client.updateWorkItem(JSON.parse(GetJson_WIT_AddRelationShip(listRelationToRemove)),idCurrentWIT)
          await workItemFormService.save();

          return Promise.resolve("");
        }
    }

    try
    {
      //Update the issue with the relation ship
       //https://docs.microsoft.com/en-us/javascript/api/azure-devops-extension-api/workitemtrackingrestclient#updateworkitem-jsonpatchdocument--number--string--boolean--boolean--boolean--workitemexpand-
       
        //TODO remove delete
        //const returnObj = await client.deleteWorkItem(idCurrentWIT,projectName,false);  
    }
    catch(e) {
        console.log('await client.deleteWorkItem Error: ', e);
        this.ShowErrorMessage()
        return Promise.resolve("");
    }

    this.setState({
      eventContent: "Opération terminée."
    });

    return Promise.resolve(urlNewWIT);
  }

  private async onClick() {
    //Ask confirmation before Removing the current workitem and Redirect to the Issue

    const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);

    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );
    let WITBug:WIT_Bug = new WIT_Bug();
    try {
      console.log("call api...")
      const opt  = new monOpt();
      await workItemFormService.getFieldValues(["Microsoft.VSTS.Build.FoundIn", "SogitecPhase", "SogitecSite", "SogitecVersion", "Sogitec.Phase", "Sogitec.Site", "Sogitec.Version", "Custom.SogitecPhase", "Custom.SogitecSite", "Custom.SogitecVersion"],opt).then(
        function (value) {
          console.log("receive values")
          var objJson = JSON.parse(JSON.stringify(value));
            Object.entries(objJson).forEach(
              value => {
                  WITBug[value[0] as string] = value[1];
                  //console.log("WIT-key:" + value[0] + "/value:" + value[1])
                }
            );  
        }
      );
    } catch(e) {
      this.ShowErrorMessage()
      console.log('await workItemFormService.getFieldValues Error: ', e);
    }

    let siteValue = "";
    let versionValue = "";
    let phaseValue = "";
    if (WITBug["SogitecPhase"] && WITBug["SogitecPhase"] != "" ) {
      phaseValue = WITBug["SogitecPhase"]
    }
    if (WITBug["Sogitec.Phase"] && WITBug["Sogitec.Phase"] != "" ) {
      phaseValue = WITBug["Sogitec.Phase"]
    }
    if (WITBug["Custom.SogitecPhase"] && WITBug["Custom.SogitecPhase"] != "" ) {
      phaseValue = WITBug["Custom.SogitecPhase"]
    }
    if (WITBug["SogitecSite"] && WITBug["SogitecSite"] != "" ) {
      siteValue = WITBug["SogitecSite"]
    }
    if (WITBug["Sogitec.Site"] && WITBug["Sogitec.Site"] != "" ) {
      siteValue = WITBug["Sogitec.Site"]
    }
    if (WITBug["Custom.SogitecSite"] && WITBug["Custom.SogitecSite"] != "" ) {
      siteValue = WITBug["Custom.SogitecSite"]
    }
    if (WITBug["SogitecVersion"] && WITBug["SogitecVersion"] != "" ) {
      versionValue = WITBug["SogitecVersion"]
    }
    if (WITBug["Sogitec.Version"] && WITBug["Sogitec.Version"] != "" ) {
      versionValue = WITBug["Sogitec.Version"]
    }
    if (WITBug["Custom.SogitecVersion"] && WITBug["Custom.SogitecVersion"] != "" ) {
      versionValue = WITBug["Custom.SogitecVersion"]
    }

    console.log("versionValue=" + versionValue);
    console.log("siteValue=" + siteValue);
    console.log("phaseValue=" + phaseValue);

    if (versionValue == "" || siteValue == "" || phaseValue == "" ) {
      dialogService.openCustomDialog<CustomValues | undefined>(SDK.getExtensionContext().id + ".panel-content", {
        title: "Veuillez renseigner les 3 champs obligatoires de la section Detection des Issues",
        configuration: {
            message: "",
            siteValue: siteValue,
            versionValue: versionValue,
            phaseValue: phaseValue
        },
        onClose: (result) => {
            if (result !== undefined && result !== null) {
              this.customValues = result;
              this.processCreateNewWIT(dialogService);
            }
        }
      });
    } else {
      this.customValues = new CustomValues(siteValue, versionValue, phaseValue);
      this.processCreateNewWIT(dialogService);
    }
  }

  private processCreateNewWIT(dialogService: IHostPageLayoutService) {
    let urlNewWIT: string = "";

    dialogService.openMessageDialog("La création d'une Issue entrainera le remplacement du Bug par une Issue. Le Bug sera supprimé.", {
      showCancel: true,
      title: "Création d'une Issue",
      onClose: async (result) => {
        if(result){
          this.ShowSpinner(true);
          urlNewWIT = await this.CreateCopyCurrentWIT("Issue", this.customValues);
          if (!!urlNewWIT)
          {
            await dialogService.openMessageDialog("L’Issue a été ouverte dans un nouvel onglet.", {
              title: "Opération terminée",
              showCancel:false          
            });
            const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
           // navService.navigate(urlNewWIT);
            navService.openNewWindow(urlNewWIT, "") ;
          }
          this.ShowSpinner(false);     
        }
      }
  });
  }
}
export default WorkItemFormGroupComponent;
showRootComponent(<WorkItemFormGroupComponent />);