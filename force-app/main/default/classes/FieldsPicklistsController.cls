global with sharing class FieldsPicklistsController extends VisualEditor.DynamicPickList {
    VisualEditor.DesignTimePageContext context;
    global FieldsPicklistsController(VisualEditor.DesignTimePageContext context) {
       this.context = context;
    }

    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', 'Select a Field');
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPicklistRows dynamicPicklistValues = new VisualEditor.DynamicPicklistRows();
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(context.entityName);
        
        if( objType == null ) {
            return dynamicPicklistValues;
        }

        for (Schema.SObjectField field : objType.getDescribe().fields.getMap().values()) {
            if(field.getDescribe().getType() == Schema.DisplayType.PICKLIST && field.getDescribe().isAccessible()){
                dynamicPicklistValues.addRow(new VisualEditor.DataRow(field.getDescribe().getLabel(), field.getDescribe().getName()));
            }
        }
        
        return dynamicPicklistValues;
    }
}