import { SolidBeforeListDataLoad, SolidListUiEventResponse } from '@solidxai/core-ui';

const AttendanceOnBeforeDataLoad = async (
    event: SolidBeforeListDataLoad
): Promise<SolidListUiEventResponse> => {

    const { filter, queryParams } = event;

    const newFilter = { ...filter };

    newFilter.filters = newFilter.filters || {};
    newFilter.filters.$and = newFilter.filters.$and || [];

    const { menuItemName: menuName } = queryParams;

    // Today Date
    const today = new Date();

    // YYYY-MM-DD format
    const todayDate = today.toISOString().split('T')[0];

    // Current Month Start Date
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Current Month End Date
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];

    switch (menuName) {

        case "all-attendance-menu-item":
            break;

        case "toady-attendance-menu-item":

            newFilter.filters.$and.push({
                attendanceDate: {
                    $eq: todayDate
                }
            });

            break;

        case "current-attendance-menu-item":

            newFilter.filters.$and.push({
                attendanceDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            break;

        default:
            break;
    }

    return {
        newFilter,
        filterApplied: true
    };
};

export default AttendanceOnBeforeDataLoad;