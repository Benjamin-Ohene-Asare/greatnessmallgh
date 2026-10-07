import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../component/AdminSidebar";
import AdminTopbar from "../component/AdminTopbar";

import "./AdminLayout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">

      {/* ==============================================
          ADMIN SIDEBAR

          Frontend navigation only.

          SECURITY:
          This does not protect admin routes.
          Django authentication and authorization
          will be responsible for that later.
      =============================================== */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />


      {/* ==============================================
          MAIN ADMIN AREA
      =============================================== */}

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