import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import "./CustomerDashboardLayout.css";


const CustomerDashboardLayout = () => {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  return (
    <div className="customer-dashboard-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="customer-dashboard-main">
        <Header
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="customer-dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default CustomerDashboardLayout;