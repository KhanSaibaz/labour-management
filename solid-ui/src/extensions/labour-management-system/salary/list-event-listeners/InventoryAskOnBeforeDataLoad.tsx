import { SolidBeforeListDataLoad, SolidListUiEventResponse } from '@solidxai/core-ui';

const CurrentMonthSalaryDataLoad = async (event: SolidBeforeListDataLoad): Promise<SolidListUiEventResponse> => {
    const { viewMetadata, filter, user, session, queryParams } = event;

    console.log('Event',event);
    

    const newFilter = { ...filter };
    newFilter.filters = newFilter.filters || {};
    newFilter.filters.$and = newFilter.filters.$and || [];

    const { menuItemName: menuName } = queryParams;

    switch (menuName) {
        case "all-salary-menu-item":
            break;

        case "current-month-salary-menu-item":
            newFilter.filters.$and.push({ status: { $eq: "Pending" } });
            break;


        default:
            break;
    }

    return {
        newFilter: newFilter,
        filterApplied: true
    }
}

export default CurrentMonthSalaryDataLoad;