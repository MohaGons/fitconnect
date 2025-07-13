
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import * as Sentry from "@sentry/react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import App from "./routes/App.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1, 
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1, 
    },
  },
});
Sentry.init({
  dsn: "https://6ef82ca121759513b3669610879c74f7@o4509640868102144.ingest.de.sentry.io/4509640878194768",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <Sentry.ErrorBoundary fallback={<p>Une erreur est survenue.</p>}>
              <App />
            </Sentry.ErrorBoundary>
          </UserProvider>
        </QueryClientProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);

