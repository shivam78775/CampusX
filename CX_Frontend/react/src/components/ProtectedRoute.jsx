import React, { useEffect, useState } from "react";
import { checkAuth } from "../utils/checkAuth";
import RestrictedAccess from "../pages/RestrictedAccess";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const user = await checkAuth();
      setAuthenticated(!!user);
      setLoading(false);
    };
    verify();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white animate-fadeIn">
        <div className="text-center">
          <LoadingSpinner size="lg" color="blue" text="Checking access..." />
        </div>
      </div>
    );
  }

  return authenticated ? children : <RestrictedAccess />;
}
