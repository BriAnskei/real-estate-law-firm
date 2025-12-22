import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { setupAxiosInterceptors } from "./util/api/axiosInstance.ts";
import { BrowserRouter } from "react-router-dom";
import Snowfall from "react-snowfall";

setupAxiosInterceptors(store);

createRoot(document.getElementById("root")!).render(
  <>
    <Snowfall />
    <BrowserRouter>
      <Provider store={store}>
        <StrictMode>
          <ThemeProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </ThemeProvider>
        </StrictMode>
      </Provider>
    </BrowserRouter>
  </>
);
