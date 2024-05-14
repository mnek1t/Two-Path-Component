import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
export default class TwoPathComponent extends LightningElement 
{
    @api lookupApiName;
    @api fieldApiName;
    @api recordId;
    @api fieldApiName2;
    @api objectApiName;
    @api recordType;
    
    fieldAndParent;
    fields = [];
    parentIdValue;

    connectedCallback() {
        try {
            this.getSelectionFromConfigurator();
        }
        catch (error) {
            console.error('Error parsing lookupApiName:', error);
        }
    }

    @wire(getRecord, {recordId: '$recordId', fields: '$fields' }) 
    getParentRecord({ error, data }) {
        if (data) {
            this.parentIdValue = data.fields[this.fieldAndParent.fieldName].value;
        } 
        if (error) {
            console.error(error);
        }
    }

    //handle information about parent object from Configurator in Lightning App Builder
    getSelectionFromConfigurator() {
        if(this.lookupApiName) {
            this.fieldAndParent = JSON.parse(this.lookupApiName);
            const stringInterpolation = this.fieldAndParent.parentName + '.' + this.fieldAndParent.fieldName;
            this.fields = [stringInterpolation];
        }
    }

    get isAppPage() {
        return location.pathname.startsWith('/lightning/n/');
    }

    get isRecordPage() {
        return location.pathname.startsWith('/lightning/r/');
    }

    get isHomePage() {
        return location.pathname.startsWith('/lightning/page/home');
    }
}