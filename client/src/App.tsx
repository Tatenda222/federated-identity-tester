import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, user, checkAuthStatus } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check auth status when component mounts or when URL changes
    checkAuthStatus();
  }, [checkAuthStatus, location]);

  // Redirect to login if accessing protected routes while not authenticated
  useEffect(() => {
    if (!isAuthenticated && location.startsWith("/dashboard")) {
      setLocation("/");
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboard/:tab" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
