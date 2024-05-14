global with sharing class ObjectsPicklistController extends VisualEditor.DynamicPickList{
    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', 'Select a Field');
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows dynamicPicklistValues = new VisualEditor.DynamicPickListRows();
        Map<String, Schema.SObjectType> objects = Schema.getGlobalDescribe();

        for(Schema.SObjectType item : objects.values()) {
            Schema.DescribeSObjectResult sobjectDescribe = item.getDescribe();

            if(sobjectDescribe.isAccessible()) {
                dynamicPicklistValues.addRow(new VisualEditor.DataRow(sobjectDescribe.getName(),sobjectDescribe.getLabel()));
            }
        }
        return dynamicPicklistValues;
    }
}