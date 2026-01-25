import { useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { BrowserRouter } from "react-router-dom";

import { runBootstrap } from "./app/bootstrap";
import { AuthProvider, useAuth } from "./store/auth";
import type { AuthBootstrapResult } from "./app/bootstrap/auth.bootstrap";
import { AppRoutes } from "./routes";

/**
 * ----------------------------------
 * Bootstrap State
 * ----------------------------------
 */
type BootstrapState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; error: Error };

/**
 * ----------------------------------
 * App Content (ROUTES ONLY)
 * ----------------------------------
 */
const AppContent = () => {
  return <AppRoutes />;
};

/**
 * ----------------------------------
 * Root App
 * ----------------------------------
 */
const App = () => {
  const [bootstrap, setBootstrap] = useState<BootstrapState>({
    status: "loading",
  });

  return (
    <AuthProvider>
      <BrowserRouter>
        <BootstrapGate
          bootstrap={bootstrap}
          setBootstrap={setBootstrap}
        >
          <AppContent />
        </BootstrapGate>
      </BrowserRouter>
    </AuthProvider>
  );
};

/**
 * ----------------------------------
 * Bootstrap Gate
 * ----------------------------------
 */
type GateProps = {
  bootstrap: BootstrapState;
  setBootstrap: Dispatch<SetStateAction<BootstrapState>>;
  children: ReactNode;
};

const BootstrapGate = ({
  bootstrap,
  setBootstrap,
  children,
}: GateProps) => {
  const { setAuthState } = useAuth();

  useEffect(() => {
    const start = async () => {
      try {
        const authResult: AuthBootstrapResult =
          await runBootstrap();

        /**
         * 🔑 IMPORTANT FIX:
         * - Bootstrap only hydrates auth state
         * - Does NOT control navigation
         */
        setAuthState({
          isAuthenticated: authResult.isAuthenticated,
          user: authResult.user,
          loading: false,
        });

        setBootstrap({ status: "ready" });
      } catch (error) {
        /**
         * 🔑 EVEN ON ERROR:
         * - App should still start (public routes)
         */
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });

        setBootstrap({ status: "ready" });
      }
    };

    start();
  }, [setAuthState, setBootstrap]);

  if (bootstrap.status === "loading") {
    return <div>Loading application…</div>;
  }

  return <>{children}</>;
};

export default App;
