import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";


const RequireCustomer = () => {
  const {
    customer,
    loading,
  } = useCustomerAuth();

  const location = useLocation();


  if (loading) {
    return (
      <div className="customer-auth-loading">
        Loading your account...
      </div>
    );
  }


  if (!customer) {
    return (
      <Navigate
        to="/account/auth"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  return <Outlet />;
};


export default RequireCustomer;