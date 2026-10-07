import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  getAdminSession,
} from "../../../services/backend";


const RequireAdmin = () => {
  const location =
    useLocation();

  const [
    status,
    setStatus,
  ] = useState("loading");


  useEffect(() => {
    let cancelled = false;

    const verifyAdmin =
      async () => {
        try {
          const user =
            await getAdminSession();

          if (cancelled) {
            return;
          }

          setStatus(
            user?.is_staff
              ? "authenticated"
              : "unauthenticated"
          );
        } catch {
          if (!cancelled) {
            setStatus(
              "unauthenticated"
            );
          }
        }
      };

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, []);


  if (status === "loading") {
    return (
      <div className="admin-auth-loading">
        Checking administrator access...
      </div>
    );
  }


  if (
    status ===
    "unauthenticated"
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  return <Outlet />;
};


export default RequireAdmin;