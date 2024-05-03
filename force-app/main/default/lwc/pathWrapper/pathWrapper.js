import { LightningElement, api, wire } from 'lwc';
import getObj from '@salesforce/apex/MetaConfigurationController.getObj';

export default class PathWrapper extends LightningElement 
{
    @api fieldApiName3
    @api fieldApiName4

    @api fieldApiName
    @api recordId
    @api fieldApiName2
    @api hideUpdateButton
    @api objectApiName
    @api recordType

    @wire(getObj, {obj: '$objectApiName'})
    objSelection(){
        if(this.objectApiName){
            console.log('this.objectApiName',this.objectApiName)
            //commented call of the event defined as Dynamic Interaction. Attempt to do "dependency of the picklists"
            // this.dispatchEvent(
            //     new CustomEvent("objectselected", {
            //       detail: {objectApiName : this.objectApiName}
            //     })
            //   );
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