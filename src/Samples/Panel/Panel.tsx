import "./Panel.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Button } from "azure-devops-ui/Button";
import { FormItem } from "azure-devops-ui/FormItem";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { showRootComponent } from "../../Common";
import { TextField } from "azure-devops-ui/TextField";
import { CustomValues } from "../Utils/Utils";
import { Observer } from "azure-devops-ui/Observer";
import { Dialog } from "azure-devops-ui/Dialog";

class PanelContent extends React.Component<{}> {

    private isDialogOpen = new ObservableValue<boolean>(false);

    private selectedItem = new ObservableValue<string>("");
    private defaultPhaseSelection = new DropdownSelection();   
    private workItemVersionValue = new ObservableValue<string>("");
    private workItemPhaseValue = new ObservableValue<string>("");
    private workItemSiteValue = new ObservableValue<string>("");

    private phaseItemsList = [
        {id:"item0", text:"Delivery"},
        {id:"item1", text:"Development"},
        {id:"item2", text:"Integration"},
        {id:"item3", text:"Other"},
        {id:"item4", text:"Out of warranty & MCO"},
        {id:"item5", text:"Qualification"},
        {id:"item6", text:"Validation"},
        {id:"item7", text:"Warranty & MCO"},
        {id:"item8", text:"Workshop"}
    ]

    constructor(props: {}) {
        super(props);
        this.state = {};
    }


    public componentDidMount() {        
        SDK.init();
        
        SDK.ready().then(() => {
            const config = SDK.getConfiguration();

            const message = config.message || "Custom dialog message";
            const siteValue = config.siteValue;
            const versionValue = config.versionValue;
            const phaseValue = config.phaseValue;

            this.workItemSiteValue.value = siteValue
            this.workItemVersionValue.value = versionValue
            this.workItemPhaseValue.value = phaseValue

            if (phaseValue && phaseValue != "") {
                let i = 0
                this.phaseItemsList.forEach((phaseElement) => {
                    if (phaseElement.text == phaseValue) {
                        this.defaultPhaseSelection.select(i);
                        this.selectedItem.value = phaseValue
                        console.log("find phase in list :" + phaseValue + " index:" + i);
                    }
                    i++
                })
            }

            if (config.dialog) {
                // Give the host frame the size of our dialog content so that the dialog can be sized appropriately.
                // This is the case where we know our content size and can explicitly provide it to SDK.resize. If our
                // size is dynamic, we have to make sure our frame is visible before calling SDK.resize() with no arguments.
                // In that case, we would instead do something like this:
                //
                // SDK.notifyLoadSucceeded().then(() => {
                //    // we are visible in this callback.
                //    SDK.resize();
                // });
                SDK.resize(400, 300);
            }
        });
    }

    public render(): JSX.Element {
        const onDismiss = () => {
            this.isDialogOpen.value = false;
        };

        return (
            <div className="sample-panel flex-column flex-grow">
                    <FormItem
                        label = "Phase:"
                    >
                    <Dropdown
                                ariaLabel="Aria label" 
                                placeholder="Valeur obligatoire"
                                items={this.phaseItemsList}
                                selection={this.defaultPhaseSelection}
                                onSelect={this.onSelect}
                    />
                    </FormItem>
                    <TextField 
                                
                                label="Site:"
                                ariaLabel="Aria label"  
                                placeholder="Valeur obligatoire"
                                required={true}
                                value={this.workItemSiteValue}
                                onChange={(e, newValue) => {this.workItemSiteValue.value = newValue;} } />
                
                    <TextField 
                            label="Version:"
                            ariaLabel="Aria label"
                            placeholder="Valeur obligatoire"   
                            required={true} 
                            value={this.workItemVersionValue}
                            onChange={(e, newValue) => {this.workItemVersionValue.value = newValue;} } />

                <div>
                <ButtonGroup className="sample-panel-button-bar">
                    <Button
                        primary={true}
                        text="OK"
                        onClick={() => this.sendChoice(true)}
                    />
                    <Button
                        text="Cancel"
                        onClick={() => this.sendChoice(false)}
                    />
                </ButtonGroup>
                </div>

                <Observer isDialogOpen={this.isDialogOpen}>

                    {(props: { isDialogOpen: boolean }) => {
                        return props.isDialogOpen ? (
                            <Dialog
                                titleProps={{ text: "Information" }}
                                footerButtonProps={[
                                    {
                                        text: "Ok",
                                        onClick: onDismiss
                                    }
                                ]}
                                onDismiss={onDismiss}
                            >
                                Merci de remplir tous les champs.
                            </Dialog>
                        ) : null;
                    }}
                </Observer>
            </div>


        );
    }
    
    private onSelect = (event: React.SyntheticEvent<HTMLElement>,item:IListBoxItem<{}>) =>{
        this.selectedItem.value = item.text || "";
        //console.log("2nd item text : " + item.text)
    };

    private isPanelValid(){
        return !!(this.selectedItem.value) && !!(this.workItemSiteValue.value) && !!(this.workItemVersionValue.value);
    }

    private sendChoice(useValue: boolean) {
        const config = SDK.getConfiguration();
        let result = null;
        //alert("sendChoice :" + useValue)
        if (useValue)
        {
            if (!this.isPanelValid())
            {
                //alert("dans non isPanelValid:" + this.isPanelValid())
                //Affiche popup pour signaler que tous les champs sont obligatoires
                this.isDialogOpen.value = true;
            }
            else
            {
                //alert("dans  isPanelValid:" + this.isPanelValid())
                result = new CustomValues(this.workItemSiteValue.value,this.workItemVersionValue.value,this.selectedItem.value);
                
                this.closePanel(config, result);
            }

        }
        else
        {
            this.closePanel(config, result);
        }
       
   

        
    }

    private closePanel(config: { [key: string]: any; }, result: null|CustomValues) {
        if (config.dialog) {
            config.dialog.close(result);
        }
        else if (config.panel) {
            config.panel.close(result);
        }
    }
}

showRootComponent(<PanelContent />);


