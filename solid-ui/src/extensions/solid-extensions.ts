import { registerExtensionComponent, registerExtensionFunction } from "@solidxai/core-ui";
import InventoryAskOnBeforeListDataLoad from "./labour-management-system/inventory-ask/list-event-listeners/InventoryAskOnBeforeDataLoad";
import CurrentMonthSalaryDataLoad from "./labour-management-system/salary/list-event-listeners/InventoryAskOnBeforeDataLoad";



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




// Module - Labour Management System 

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


