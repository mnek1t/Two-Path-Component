import { LightningElement, api, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
 
export default class Path extends LightningElement 
{
    @api fieldApiName;
    @api objectApiName;
    @api recordId;
    @api recordType;

    recordTypeId;
    objectInfo;
    fieldValueList;
    formattedFieldApiName;

    selectedStep;
    currentStep;

    //flag to prevent endless updation
    userTriggeredUpdate = false;

    @wire(getRecord, { recordId: '$recordId', layoutTypes: ["Full"], modes:['View'] })
    recordInfoHandler({data, error}){
        if(data && data.fields[this.fieldApiName]) {
            this.currentStep = data.fields[this.fieldApiName].value;
            this.selectedStep = this.currentStep;
            this.formattedFieldApiName = data.apiName + '.' + this.fieldApiName;
            this.objectApiName = data.apiName;
            this.recordTypeId = data.recordTypeId;
        }
        if(error) {
            console.error('error', error);
        }
    }

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;
     
    @wire(getPicklistValues, { recordTypeId: "$recordTypeId", fieldApiName: '$formattedFieldApiName' })
    picklistValuesHandler({data, error}) {
        if(data) {
            this.fieldValueList = data.values.map((step) => step.value);
        }
        if(error) {
            console.error('error', error)
        }
    }

    handleSelection(event) {
        this.selectedStep = event.target.label;

        //organise record to update 
        const fields = {};
        fields.Id = this.recordId;
        fields[this.fieldApiName] = this.selectedStep;
        const recordInput = { fields };

        this.userTriggeredUpdate = true;
        if(this.userTriggeredUpdate && this.selectedStep !== this.currentStep) {
            this.updatePicklistValue(recordInput);
        }
    }

    updatePicklistValue(recordInput) {
        updateRecord(recordInput)
        .then(() => {
            this.showToast("Success", "Picklist updated", "success");
            this.userTriggeredUpdate = false;
        })
        .catch((error) => {
            this.showToast("Error creating record", error.body.message, "error" );
            this.userTriggeredUpdate = false;
        });
    }
    
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
              title,
              message,
              variant,
            }),
        );
    }

    get heading() {
        if(this.objectInfo.data) {  
            const fieldInfo = this.objectInfo.data.fields[this.fieldApiName];
            return fieldInfo ? fieldInfo.label : '';
        }
        return '';
    }
    
}