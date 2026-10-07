import React, {
  useState,
} from "react";

import {
  Menu,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  adminLogout,
} from "../../../services/backend";

import "./AdminTopbar.css";


const AdminTopbar = ({
  onMenuClick,
}) => {
  const navigate =
    useNavigate();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  // Sign out the current administrator
  const handleLogout =
    async () => {
      if (loggingOut) {
        return;
      }

      try {
        setLoggingOut(true);

        await adminLogout();

        navigate(
          "/admin/login",
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Admin logout failed:",
          error
        );
      } finally {
        setLoggingOut(false);
      }
    };


  return (
    <header className="admin-topbar">

      <div className="admin-topbar-left">

        <button
          type="button"
          className="admin-mobile-menu-button"
          onClick={
            onMenuClick
          }
          aria-label="Open dashboard navigation"
        >
          <Menu
            size={22}
            strokeWidth={1.8}
          />
        </button>


        <div className="admin-topbar-search">

          <Search
            size={17}
            strokeWidth={1.7}
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search dashboard..."
            aria-label="Search dashboard"
          />

        </div>

      </div>


      <div className="admin-topbar-actions">

        <button
          type="button"
          className="admin-notification-button"
          aria-label="Notifications"
        >
          <Bell
            size={19}
            strokeWidth={1.7}
          />
        </button>


        <div className="admin-user">

          <div className="admin-user-avatar">
            A
          </div>

          <div className="admin-user-details">

            <strong>
              Administrator
            </strong>

            <span>
              Greatness Mall
            </span>

          </div>

        </div>


        <button
          type="button"
          className="admin-logout-button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
          aria-label="Sign out"
        >

          <LogOut
            size={18}
            strokeWidth={1.7}
            aria-hidden="true"
          />

          <span>
            {loggingOut
              ? "Signing out..."
              : "Logout"}
          </span>

        </button>

      </div>

    </header>
  );
};


export default AdminTopbar;