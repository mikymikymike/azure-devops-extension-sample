export class CustomValues
{
  workItemSite : string;
  workItemVersion : string;
  workItemPhase : string;

  
  constructor(workItemSiteValue: string, workItemVersionValue: string,  workItemPhaseValue: string  ) {
    this.workItemSite = workItemSiteValue;
    this.workItemVersion = workItemVersionValue;
    this.workItemPhase = workItemPhaseValue;
  }
}