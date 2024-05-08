global with sharing class MetaConfigurationController extends VisualEditor.DynamicPickList{
    //overriding VisualEditor.DynamicPickList methods
    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', 'Account');
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows dynamicPicklistValues = new VisualEditor.DynamicPickListRows();
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe(); // get all objects in the org
        for(Schema.SObjectType item : gd.values()){
            Schema.DescribeSObjectResult sobjectDescribe = item.getDescribe();

            //add only accessible objects to running user 
            if(sobjectDescribe.isAccessible()){
                dynamicPicklistValues.addRow(new VisualEditor.DataRow(sobjectDescribe.getName(),sobjectDescribe.getLabel()));
            }
        }
        return dynamicPicklistValues;
    }
}