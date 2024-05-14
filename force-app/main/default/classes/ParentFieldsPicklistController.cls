global with sharing class ParentFieldsPicklistController extends VisualEditor.DynamicPickList {
    VisualEditor.DesignTimePageContext context;
    global ParentFieldsPicklistController(VisualEditor.DesignTimePageContext context) {
       this.context = context;
    }

    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', 'Selcet A Field');
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPicklistRows dynamicPicklistValues = new VisualEditor.DynamicPicklistRows();
        Schema.SObjectType objType =  Schema.getGlobalDescribe().get(context.entityName);
        
        if(objType == null) {
            return dynamicPicklistValues;
        }

        Map<String, Schema.SObjectField> fieldMap = objType.getDescribe().fields.getMap();
        for (String fieldName: fieldMap.keySet()) {
            Schema.SObjectField field = fieldMap.get(fieldName);
            Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
            if (fieldDescribe.getType() != Schema.DisplayType.Reference) {
                continue;
            }

            List<Schema.SObjectType> referenceTo = fieldDescribe.getReferenceTo();
            Map<String, String> fieldAndParent = new Map<String, String>();
            for (Schema.SObjectType parentObjType: referenceTo) {
                fieldAndParent.put('fieldName', fieldDescribe.getLocalName());
                fieldAndParent.put('parentName', parentObjType.getDescribe().getName());
                String jsonString = JSON.serialize(fieldAndParent);
                dynamicPicklistValues.addRow(new VisualEditor.DataRow(fieldDescribe.getLocalName(),jsonString));
            }
        }
        
        return dynamicPicklistValues;
    }
}