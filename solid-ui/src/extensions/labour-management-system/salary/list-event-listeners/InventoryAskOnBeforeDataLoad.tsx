import { SolidBeforeListDataLoad, SolidListUiEventResponse } from '@solidxai/core-ui';

const CurrentMonthSalaryDataLoad = async (
    event: SolidBeforeListDataLoad
): Promise<SolidListUiEventResponse> => {
    const { filter, queryParams } = event;

    const newFilter = { ...filter };
    newFilter.filters = newFilter.filters || {};
    newFilter.filters.$and = newFilter.filters.$and || [];

    const { menuItemName: menuName } = queryParams;

    const now = new Date();

    const currentYear = now.getFullYear().toString();

    const months = [
        "january", "february", "march", "april",
        "may", "june", "july", "august",
        "september", "october", "november", "december"
    ];

    const currentMonth = months[now.getMonth()];

    switch (menuName) {
        case "all-salary-menu-item":
            break;

        case "current-month-salary-menu-item":
            newFilter.filters.$and.push({ salaryYear: { $eq: currentYear } });
            newFilter.filters.$and.push({ salaryMonth: { $eq: currentMonth } });

            break;

        default:
            break;
    }

    return {
        newFilter,
        filterApplied: true
    };
};

export default CurrentMonthSalaryDataLoad;