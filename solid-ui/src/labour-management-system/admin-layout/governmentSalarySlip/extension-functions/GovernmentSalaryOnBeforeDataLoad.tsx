import {
    SolidBeforeListDataLoad,
    SolidListUiEventResponse
} from '@solidxai/core-ui';

const GovernmentSalaryOnBeforeDataLoad = async (
    event: SolidBeforeListDataLoad
): Promise<SolidListUiEventResponse> => {
    const { filter, queryParams } = event;

    const newFilter = { ...filter };

    newFilter.filters = newFilter.filters || {};
    newFilter.filters.$and = newFilter.filters.$and || [];

    const { menuItemName: menuName } = queryParams;

    switch (menuName) {
        case 'all-government-salary-slip-menu-item':
            break;

        case 'included-government-salary-slip-menu-item':
            newFilter.filters.$and.push({ isGenerateSlip: { $eq: true } });

            break;

        case 'excluded-government-salary-slip-menu-item':
            newFilter.filters.$and.push({ isGenerateSlip: { $eq: false } });

            break;

        default:
            break;
    }

    return {
        newFilter,
        filterApplied: true
    };
};

export default GovernmentSalaryOnBeforeDataLoad;