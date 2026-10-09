import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../component/AdminSidebar";
import AdminTopbar from "../component/AdminTopbar";
import AdminTour from "../component/AdminTour";

import "./AdminLayout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <AdminTour />

      <div className="admin-main">
        <AdminTopbar
          onMenuClick={openSidebar}
        />

        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;