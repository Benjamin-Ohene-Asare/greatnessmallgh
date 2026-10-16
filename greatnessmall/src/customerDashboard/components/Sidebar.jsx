import {
  Home,
  LogOut,
  Package,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";


const Sidebar = ({
  open,
  onClose,
}) => {
  const navigate =
    useNavigate();

  const {
    customer,
    signOut,
  } = useCustomerAuth();

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  const [
    logoutError,
    setLogoutError,
  ] = useState("");


  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }

    setLogoutError("");
    setSigningOut(true);

    try {
      await signOut();

      navigate(
        "/account/auth",
        {
          replace: true,
        }
      );
    } catch {
      setLogoutError(
        "Could not sign out. Please try again."
      );
    } finally {
      setSigningOut(false);
    }
  };


  const closeSidebar = () => {
    if (onClose) {
      onClose();
    }
  };


  return (
    <>
      {open && (
        <button
          type="button"
          className="customer-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close account menu"
        />
      )}

      <aside
        className={
          open
            ? "customer-sidebar is-open"
            : "customer-sidebar"
        }
      >
        <div className="customer-sidebar-top">
          <div>
            <span>
              Greatness Mall
            </span>

            <strong>
              My Account
            </strong>
          </div>

          <button
            type="button"
            className="customer-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close account menu"
          >
            <X size={20} />
          </button>
        </div>


        <div className="customer-sidebar-profile">
          <div className="customer-sidebar-profile-icon">
            <UserRound size={20} />
          </div>

          <div>
            <strong>
              {customer?.full_name ||
                "Customer"}
            </strong>

            <span>
              {customer?.email}
            </span>
          </div>
        </div>


        <nav className="customer-sidebar-nav">
          <NavLink
            to="/account"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            <Home size={19} />
            <span>
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/account/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            <Package size={19} />
            <span>
              My Orders
            </span>
          </NavLink>

          <NavLink
            to="/account/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "active"
                : ""
            }
          >
            <UserRound size={19} />
            <span>
              Profile
            </span>
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeSidebar}
          >
            <ShoppingBag size={19} />
            <span>
              Shop Products
            </span>
          </NavLink>
        </nav>


        <div className="customer-sidebar-bottom">
          {logoutError && (
            <p
              className="customer-sidebar-error"
              role="alert"
            >
              {logoutError}
            </p>
          )}

          <button
            type="button"
            className="customer-sidebar-logout"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut size={19} />

            <span>
              {signingOut
                ? "Signing out..."
                : "Sign Out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;