import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
export default class PathWrapper extends LightningElement 
{
    @api lookupApiName

    @api fieldApiName
    @api recordId
    @api fieldApiName2
    @api objectApiName
    @api recordType
    
    fieldAndParent
    fields = [];
    parentIdValue

    connectedCallback()
    {
        try{
            this.getSelectionFromConfigurator();
        }
        catch (error) {
            console.error('Error parsing lookupApiName:', error);
        }
    }

    //get parent record info and its lookup Id field 
    @wire(getRecord, { recordId: '$recordId', fields: '$fields' }) 
    wiredRecord({ error, data }) {
        if (data) {
            this.parentIdValue = data.fields[this.fieldAndParent.fieldName].value
            console.log('Field Value in wire service:', data.fields[this.fieldAndParent.fieldName].value);
        } else if (error) {
            console.error(error)
        }
    }

    //handle information about parent object from Configurator in Lightning App Builder
    getSelectionFromConfigurator()
    {
        if(this.lookupApiName)
            {
                this.fieldAndParent = JSON.parse(this.lookupApiName);
                this.fields = [this.fieldAndParent.parentName+'.'+this.fieldAndParent.fieldName]; 
            }
    }

    //is component placed on the App Page
    get isAppPage() {
        return location.pathname.startsWith('/lightning/n/')
    }

    //is component placed on the Record Page
    get isRecordPage() {
        return location.pathname.startsWith('/lightning/r/')
    }

    //is component placed on the Home Page
    get isHomePage() {
        return location.pathname.startsWith('/lightning/page/home');
    }
}