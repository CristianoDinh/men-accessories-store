import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import pages
import { App } from "./App";
// import styles
import "./styles/global/global.css";
// import route
import router from "./routes/CombineRoute";
// import store
import store from "./redux/store";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="439535556467-i5r5jt9ai9oq5g048c6ga73khbdpqidl.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </Provider>
);
