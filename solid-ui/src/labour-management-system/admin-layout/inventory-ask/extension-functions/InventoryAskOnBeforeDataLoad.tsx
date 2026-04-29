import { SolidBeforeListDataLoad, SolidListUiEventResponse } from '@solidxai/core-ui';

const InventoryAskOnBeforeListDataLoad = async (event: SolidBeforeListDataLoad): Promise<SolidListUiEventResponse> => {
    const { viewMetadata, filter, user, session, queryParams } = event;

    console.log('Event',event);
    

    const newFilter = { ...filter };
    newFilter.filters = newFilter.filters || {};
    newFilter.filters.$and = newFilter.filters.$and || [];

    const { menuItemName: menuName } = queryParams;

    switch (menuName) {
        case "inventoryAsk-menu-item":
            break;

        case "inventoryAsk-withPending-menu-item":
            newFilter.filters.$and.push({ status: { $eq: "Pending" } });
            break;

        case "inventoryAsk-withInProgress-menu-item":
            newFilter.filters.$and.push({ status: { $eq: "InProgress" } }); 
            break;

        case "inventoryAsk-withCompleted-menu-item":
            newFilter.filters.$and.push({ status: { $eq: "Completed" } }); 
            break;

        default:
            break;
    }

    return {
        newFilter: newFilter,
        filterApplied: true
    }
}

export default InventoryAskOnBeforeListDataLoad;