import ErrorComponent from "./components/error-component.tsx";
import FontProvider from "./components/font/context/font-provider.tsx";
import ThemeProvider from "./components/theme/context/theme-provider.tsx";
import "./index.css";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider.tsx";
import { routeTree } from "./routeTree.gen.ts";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: false,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ErrorComponent,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <TanstackQuery.Provider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <FontProvider storageKey="vite-ui-font">
            <RouterProvider router={router} />
          </FontProvider>
        </ThemeProvider>
      </TanstackQuery.Provider>
    </StrictMode>
  );
}
