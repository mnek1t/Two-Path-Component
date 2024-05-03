global with sharing class LwcGetRecordTypeValues extends VisualEditor.DynamicPickList {

    //store context of the current page
    VisualEditor.DesignTimePageContext context;
    global LwcGetRecordTypeValues(VisualEditor.DesignTimePageContext context) {
       this.context = context;
    }

    //overriding VisualEditor.DynamicPickList methods
    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', 'Select a Record Type');
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows dynamicPicklistValues = new VisualEditor.DynamicPickListRows();
        
        Schema.DescribeSObjectResult obj = Schema.getGlobalDescribe().get(context.entityName).getDescribe();
        List<Schema.RecordTypeInfo> recordTypesInfo = obj.getRecordTypeInfos();
        
        for (Schema.RecordTypeInfo recrodType : recordTypesInfo) {

            //return only those record types that are accessible for running user
            if(recrodType.isAvailable()){
                dynamicPicklistValues.addRow(new VisualEditor.DataRow(recrodType.getName(), recrodType.getDeveloperName()));
            }
        }

        return dynamicPicklistValues;
    }
}