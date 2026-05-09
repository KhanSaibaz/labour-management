import { createElement } from "react";
import {
  ExtensionComponentTypes,
  ExtensionFunctionTypes,
  type SolidUiModule,
} from "@solidxai/core-ui";

import { AdminInfoPage } from "./custom-layout/admin/AdminInfoPage";
import { HelloAuthPage } from "./custom-layout/auth/HelloAuthPage";
import { AboutPage } from "./custom-layout/static/AboutPage";

import CurrentMonthSalaryDataLoad from "./admin-layout/salary/extension-functions/InventoryAskOnBeforeDataLoad";
import { CalculateSalary } from "./admin-layout/salary/extension-components/CalculateSalary";
import { GenerateGovernmentSalarySlip } from "./admin-layout/governmentSalarySlip/extension-components/GenerateGovernmentSalarySlip";

import { governmentSalarySlipApi } from "./redux/governmentSalarySlipApi";
import { labourDashBoardApi } from "./redux/dasboardApi";
import { DashBoardPage } from "./custom-layout/admin/DashboardPage";
import GenerateSalarySlip from "./admin-layout/salary/extension-components/GenerateSalarySlip";
import AttendanceOnBeforeDataLoad from "./admin-layout/attendance/extension-functions/AttendanceOnBeforeDataLoad";

const labourManagementSystemUiModule = {
  name: "labour-management-system",
  routes: {
    extraAuthRoutes: [
      { path: "/auth/hello", element: createElement(HelloAuthPage) },
    ],
    extraAdminRoutes: [
      { path: "/admin/info", element: createElement(AdminInfoPage) },
      { path: "/admin/core/labour-management-system/dashboard", element: createElement(DashBoardPage) },
    ],
    extraRoutes: [
      { path: "/about", element: createElement(AboutPage) },
    ],
  },
  extensionComponents: [
    {
      name: "CalculateSalary",
      component: CalculateSalary,
      type: ExtensionComponentTypes.listHeaderAction,
    },
    {
      name: "GenerateGovernmentSalarySlip",
      component: GenerateGovernmentSalarySlip,
      type: ExtensionComponentTypes.listHeaderAction,
    },

      {
      name: "GenerateSalarySlip",
      component: GenerateSalarySlip,
      type: ExtensionComponentTypes.formAction,
    },

  ],
  extensionFunctions: [
    {
      name: "AttendanceOnBeforeDataLoad",
      fn: AttendanceOnBeforeDataLoad,
      type: ExtensionFunctionTypes.onBeforeListDataLoad,
    },

    {
      name: "CurrentMonthSalaryDataLoad",
      fn: CurrentMonthSalaryDataLoad,
      type: ExtensionFunctionTypes.onFormLayoutLoad,
    },

  ],
  reducers: {
    [governmentSalarySlipApi.reducerPath]: governmentSalarySlipApi.reducer,
    [labourDashBoardApi.reducerPath]: labourDashBoardApi.reducer,
  },
  middlewares: [
    governmentSalarySlipApi.middleware,
    labourDashBoardApi.middleware,
  ],
} satisfies SolidUiModule;

export default labourManagementSystemUiModule;
