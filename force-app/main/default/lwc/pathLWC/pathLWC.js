import { LightningElement, api, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
 
export default class PathLWC extends LightningElement 
{

    @api fieldApiName
    @api objectApiName 
    @api recordId
    @api recordType

    recordTypeId
    objectInfo
    fieldValueList
    formattedFieldApiName

    selectedStep
    currentStep
    lastStepName
    showCompleteStep = false
    showCurrentStep = false

    //flag to prevent endless updation
    userTriggeredUpdate = false;

    connectedCallback()
    {
        console.log('this.objectApiName',this.objectApiName )
    }
    //get info about the record
    @wire(getRecord, { recordId: '$recordId', layoutTypes: ["Full", "Compact"], modes:['View', 'Edit', 'Create']})
    recordInfoHandler({data, error}){
        if(data && data.fields[this.fieldApiName]){
            this.currentStep = data.fields[this.fieldApiName].value;
            this.selectedStep = this.currentStep;
            this.formattedFieldApiName = data.apiName + '.' + this.fieldApiName 
            this.objectApiName = data.apiName;
            //get the record type ID from the record type name
            this.recordTypeId = data.recordTypeId;
            console.log('recordInfoHandler', data)
        }
        if(error){
            console.error('error', error)
        }
    }

    //get info about the object
     @wire(getObjectInfo, { objectApiName: '$objectApiName' })
     objectInfo;
     
    //get picklist values
    @wire(getPicklistValues, { recordTypeId: "$recordTypeId", fieldApiName: '$formattedFieldApiName' })
    picklistValuesHandler({data, error}){
        if(data){
            this.fieldValueList = data.values.map((step) => step.value)
            let size = this.fieldValueList.length;
            this.lastStepName = this.fieldValueList[size-1]
            this.showCompleteStep = this.fieldValueList.indexOf(this.currentStep) > -1 ? true : false;
        }
        if(error){
            console.error('error', error)
        }
    }

    //handle click on the path item
    handleSelection(event){
        const stepName = event.target.label;
        if(this.currentStep === this.lastStepName && this.currentStep === stepName){
            this.showCompleteStep = false;
            this.showCurrentStep = false
        }
        else if((stepName === this.lastStepName && this.currentStep!==stepName)||(this.currentStep === stepName && this.currentStep !=this.lastStepName)){
            this.showCompleteStep = true;
            this.showCurrentStep = false;
            this.selectedStep = stepName
        }
        else{
            this.showCompleteStep = false;
            this.showCurrentStep = true;
            this.selectedStep = stepName
        }

        //organise record to update 
        const fields = {};
        fields.Id = this.recordId;
        fields[this.fieldApiName] = this.selectedStep
        const recordInput = { fields }

        this.userTriggeredUpdate = true;
        if(this.userTriggeredUpdate && this.selectedStep !== this.currentStep)
        {
            this.update(recordInput);
        }
    }

    //update picklist field 
    update(recordInput){
        updateRecord(recordInput)
        .then(()=>{
            this.showToast("Success","Picklist updated","success");
            this.userTriggeredUpdate = false
        })
        .catch((error) => {
            this.showToast("Error creating record",error.body.message,"error" );
            this.userTriggeredUpdate = false
        });
    }
    
    //message after the updating
    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
              title,
              message,
              variant,
            }),
          );
    }

    //get heading for the component
    get heading(){
        if(this.objectInfo.data){  
            const fieldInfo = this.objectInfo.data.fields[this.fieldApiName];
            return fieldInfo ? fieldInfo.label : '';
        }
        return '';
    }
    
}