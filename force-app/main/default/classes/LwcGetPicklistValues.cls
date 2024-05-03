global with sharing class LwcGetPicklistValues extends VisualEditor.DynamicPickList {

    //store context of the current page
    VisualEditor.DesignTimePageContext context;
    global LwcGetPicklistValues(VisualEditor.DesignTimePageContext context) {
       this.context = context;
    }

    //overriding VisualEditor.DynamicPickList methods
    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', 'Select a Field');
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPicklistRows dynamicPicklistValues = new VisualEditor.DynamicPicklistRows();

        //attempt to receive chosen object from MetaConfigurationController class. It does not work
        Schema.SObjectType objType;
        if(context.pageType == 'HomePage' || context.pageType == 'AppPage')
        {
            objType = Schema.getGlobalDescribe().get(MetaConfigurationController.objectSelected);
            //objType = Schema.getGlobalDescribe().get(context.entityName);
        }
        else
        {
            objType = Schema.getGlobalDescribe().get(context.entityName);
        }
        
        if( objType != null ){
            for (Schema.SObjectField field : objType.getDescribe().fields.getMap().values()) {

                //return only picklists that are accessible for running user
                if(field.getDescribe().getType() == Schema.DisplayType.PICKLIST && field.getDescribe().isAccessible()){
                    dynamicPicklistValues.addRow(new VisualEditor.DataRow(field.getDescribe().getLabel(), field.getDescribe().getName()));
                }
            }
        }
        return dynamicPicklistValues;
    }
}