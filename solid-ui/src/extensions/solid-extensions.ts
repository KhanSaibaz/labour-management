import { registerExtensionComponent, registerExtensionFunction } from "@solidxai/core-ui";
import InventoryAskOnBeforeListDataLoad from "./labour-management-system/inventory-ask/list-event-listeners/InventoryAskOnBeforeDataLoad";
import CurrentMonthSalaryDataLoad from "./labour-management-system/salary/list-event-listeners/InventoryAskOnBeforeDataLoad";
import { GenerateGovernmentSalarySlip } from "./labour-management-system/governmentSalarySlip/list-buttons/GenerateGovernmentSalarySlip";



// Module - Labour Management System 

// - - - - - - - - - - - - - - - - - - - -
// Model - Inventory Ask
// - - - - - - - - - - - - - - - - - - - -

// custom-widgets 

// form-buttons

// form-event-listeners (onFormLayoutLoad, onFormDataLoad, onFormLoad)
registerExtensionFunction('inventoryAskOnBeforeListDataLoad', InventoryAskOnBeforeListDataLoad);

// list-buttons

// list-event-listeners (onListLoad, onBeforeListDataLoad)

// row-buttons





// - - - - - - - - - - - - - - - - - - - -
// Model - Inventory Ask
// - - - - - - - - - - - - - - - - - - - -

// custom-widgets 

// form-buttons

// form-event-listeners (onFormLayoutLoad, onFormDataLoad, onFormLoad)
registerExtensionFunction('currentMonthSalaryDataLoad', CurrentMonthSalaryDataLoad);

// list-buttons

// list-event-listeners (onListLoad, onBeforeListDataLoad)

// row-buttons




// - - - - - - - - - - - - - - - - - - - -
// Model - Government  Salary Slip
// - - - - - - - - - - - - - - - - - - - -

// custom-widgets 

// form-buttons

// form-event-listeners (onFormLayoutLoad, onFormDataLoad, onFormLoad)

// list-buttons
registerExtensionComponent("generateGovernmentSalarySlip", GenerateGovernmentSalarySlip);


// list-event-listeners (onListLoad, onBeforeListDataLoad)

// row-buttons

