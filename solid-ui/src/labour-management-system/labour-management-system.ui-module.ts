import { createElement } from "react";
import {
  ExtensionComponentTypes,
  ExtensionFunctionTypes,
  type SolidUiModule,
} from "@solidxai/core-ui";

import { AdminInfoPage } from "./custom-layout/admin/AdminInfoPage";
import { HelloAuthPage } from "./custom-layout/auth/HelloAuthPage";
import { AboutPage } from "./custom-layout/static/AboutPage";

import InventoryAskOnBeforeListDataLoad from "./admin-layout/inventory-ask/extension-functions/InventoryAskOnBeforeDataLoad";
import CurrentMonthSalaryDataLoad from "./admin-layout/salary/extension-functions/InventoryAskOnBeforeDataLoad";
import { CalculateSalary } from "./admin-layout/salary/extension-components/CalculateSalary";
import { GenerateGovernmentSalarySlip } from "./admin-layout/governmentSalarySlip/extension-components/GenerateGovernmentSalarySlip";

import { governmentSalarySlipApi } from "./redux/governmentSalarySlipApi";
import { labourDashBoardApi } from "./redux/dasboardApi";

const labourManagementSystemUiModule = {
  name: "labour-management-system",
  routes: {
    extraAuthRoutes: [
      { path: "/auth/hello", element: createElement(HelloAuthPage) },
    ],
    extraAdminRoutes: [
      { path: "/admin/info", element: createElement(AdminInfoPage) },
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
   
  ],
  extensionFunctions: [
    {
      name: "InventoryAskOnBeforeListDataLoad",
      fn: InventoryAskOnBeforeListDataLoad,
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
