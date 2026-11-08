/** B4NDX style reminder: dark command-center landing page with Signal Lime actions and restrained motion. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Legal from "./pages/Legal";

function Page() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/privacy") return <Legal kind="privacy" />;
  if (pathname === "/terms") return <Legal kind="terms" />;
  return <Home />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Page />
          <Toaster theme="dark" position="bottom-right" />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
