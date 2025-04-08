import React, { useEffect, useState } from "react";
import { checkAuth } from "../utils/checkAuth";
import RestrictedAccess from "../pages/RestrictedAccess";

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

  if (loading) return <div className="text-center mt-10">Checking access...</div>;

  return authenticated ? children : <RestrictedAccess />;
}
