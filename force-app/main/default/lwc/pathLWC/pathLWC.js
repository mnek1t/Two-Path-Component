import { LightningElement, api, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
 
export default class PathLWC extends LightningElement 
{
    //test field received from dynamic picklist in pathWrapper
    // @api fieldApiName3
    // @api fieldApiName4

    @api fieldApiName
    @api objectApiName 
    @api recordId
    @api recordType
    recordTypeId
    objectInfo
    fieldValueList
    formattedFieldApiName
    recordInfo

    selectedStep
    currentStep
    lastStepName
    showCompleteStep = false
    showCurrentStep = false

    //flag to prevent endless updation
    userTriggeredUpdate = false;

    //get info about the record
    @wire(getRecord, { recordId: '$recordId', layoutTypes: ["Full", "Compact"], modes:['View', 'Edit', 'Create']})
    recordInfoHandler({data, error}){
        if(data){
            this.currentStep = data.fields[this.fieldApiName].value;
            this.selectedStep = this.currentStep;
            this.formattedFieldApiName = data.apiName + '.' + this.fieldApiName 
            this.recordInfo = data;
            this.objectApiName = this.objectApiName ? this.objectApiName : data.apiName;
            this.recordTypeId = data.recordTypeId;
            console.log('recordInfoHandler', data)
        }
        if(error){
            console.error('error', error)
        }
    }

    //get info about the object
    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfoHandler({data, error}){
        if(data){ 
            this.objectInfo = data;
            // this.recordTypeId = this.objectApiName.defaultRecodrdTypeId;
            // this.recordTypeId = Object.keys(this.objectInfo.recordTypeInfos)
            //     .find((rti) => this.objectInfo.recordTypeInfos[rti].name === this.recordType.replace(/_/g, ' '))
            //console.log(this.recordType)
            console.log('this.objectInfo', this.objectInfo)
            console.log('this.recordTypeId', this.recordTypeId)
        }
        else{
            console.error(error)
        }
    }

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
        if(this.currentStep === this.lastStepName && this.currentStep ===stepName){
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

    //get the record type ID from the record type name
    // get recordTypeId() {
    //     if (this.objectInfo) {
    //         console.log('this.objectInfo.recordTypeInfos', this.objectInfo.recordTypeInfos)
    //         return Object.keys(this.objectInfo.recordTypeInfos)
    //                 .find((rti) => this.objectInfo.recordTypeInfos[rti].name === this.recordType);
    //     }
    //     return null;
    // }

    //get heading for the component
    get heading(){
        if(this.objectInfo && this.objectInfo.fields[this.fieldApiName]){
            const fieldInfo = this.objectInfo.fields[this.fieldApiName];
            return fieldInfo ? fieldInfo.label : '';
        }
        return '';
    }
    
}