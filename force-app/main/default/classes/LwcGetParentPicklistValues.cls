global with sharing class LwcGetParentPicklistValues extends VisualEditor.DynamicPickList {

    //store context of the current page
    VisualEditor.DesignTimePageContext context;
    global LwcGetParentPicklistValues(VisualEditor.DesignTimePageContext context) {
       this.context = context;
    }

    //overriding VisualEditor.DynamicPickList methods
    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', '');
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPicklistRows dynamicPicklistValues = new VisualEditor.DynamicPicklistRows();

        Schema.SObjectType objType =  Schema.getGlobalDescribe().get(context.entityName);
        
        if( objType != null ){
            // Get the fields of the child object
            Map<String, Schema.SObjectField> fieldMap = objType.getDescribe().fields.getMap();
            // Iterate over the fields to find the parent
    	    for (String fieldName: fieldMap.keySet()) {
                Schema.SObjectField field = fieldMap.get(fieldName);
        	    Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
                if (fieldDescribe.getType() == Schema.DisplayType.Reference) {
                    // Get the parent object types
                    List<Schema.SObjectType> referenceTo = fieldDescribe.getReferenceTo();
                    Map<String, String> fieldAndParent = new Map<String, String>();
                    // Iterate over the parent object types
                     for (Schema.SObjectType parentObjType: referenceTo) {
                        fieldAndParent.put('fieldName', fieldDescribe.getLocalName());
                        fieldAndParent.put('parentName', parentObjType.getDescribe().getName());
                        String jsonString = JSON.serialize(fieldAndParent);
                        dynamicPicklistValues.addRow(new VisualEditor.DataRow(fieldDescribe.getLocalName(),jsonString));
                    }
                }
            }
        }
        return dynamicPicklistValues;
    }
}