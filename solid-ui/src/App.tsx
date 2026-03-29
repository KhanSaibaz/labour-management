import "@solidxai/core-ui";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { LayoutProvider, SolidThemeProvider, StoreProvider, AppEventListener } from "@solidxai/core-ui";
import { AppRoutes } from "./routes/AppRoutes";
import "./extensions/solid-extensions";
import "./index.css";
import { DashBoardApi } from "./redux/dasboardApi";

function App() {

  // custom reducers and middlewares can be added to the StoreProvider
  const venueReducers = useMemo(
    () => ({
      [DashBoardApi.reducerPath]: DashBoardApi.reducer,
    }),
    []
  );
  const venueMiddlewares = useMemo(
    () => [DashBoardApi.middleware],
    []
  );

  return (
    <BrowserRouter>
      <StoreProvider reducers={venueReducers} middlewares={venueMiddlewares}>
        <PrimeReactProvider>
          <LayoutProvider>
            <SolidThemeProvider />
            <AppEventListener />
            <AppRoutes />
          </LayoutProvider>
        </PrimeReactProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
