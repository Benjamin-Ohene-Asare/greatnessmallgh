import React from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  CalendarDays,
  Languages,
  CircleHelp,
  MessageSquareQuote,
  FileText,
  Users,
  Send,
  MessageCircle,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./AdminSidebar.css";

const AdminSidebar = ({
  isOpen,
  onClose,
}) => {

  const menuGroups = [
    {
      title: "OVERVIEW",

      items: [
        {
          label: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },

    {
      title: "CONTENT",

      items: [
        {
          label: "Products",
          path: "/admin/products",
          icon: Package,
        },

        {
          label: "Categories",
          path: "/admin/categories",
          icon: Tags,
        },

        {
          label: "Events",
          path: "/admin/events",
          icon: CalendarDays,
        },

        {
          label: "Twi Content",
          path: "/admin/twi",
          icon: Languages,
        },

        {
          label: "FAQs",
          path: "/admin/faq",
          icon: CircleHelp,
        },

        {
          label: "Testimonials",
          path: "/admin/testimonials",
          icon: MessageSquareQuote,
        },
      ],
    },

    {
      title: "MARKETING",

      items: [
        {
          label: "Opt-In Page",
          path: "/admin/opt-in",
          icon: FileText,
        },

        {
          label: "Contacts",
          path: "/admin/contacts",
          icon: Users,
        },

        {
          label: "SMS Broadcast",
          path: "/admin/sms",
          icon: Send,
        },
      ],
    },

    {
      title: "SETTINGS",

      items: [
        {
          label: "WhatsApp",
          path: "/admin/whatsapp",
          icon: MessageCircle,
        },

        {
          label: "Website Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={onClose}
          aria-label="Close dashboard navigation"
        />
      )}


      <aside
        className={
          isOpen
            ? "admin-sidebar open"
            : "admin-sidebar"
        }
      >

        {/* BRAND */}

        <div className="admin-sidebar-brand">

          <div className="admin-brand-logo">
            G
          </div>

          <div className="admin-brand-text">

            <strong>
              Greatness Mall
            </strong>

            <span>
              Admin Dashboard
            </span>

          </div>


          <button
            type="button"
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X
              size={21}
              strokeWidth={1.8}
            />
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-sidebar-nav">

          {menuGroups.map((group) => (

            <div
              className="admin-nav-group"
              key={group.title}
            >

              <span className="admin-nav-title">
                {group.title}
              </span>


              <div className="admin-nav-links">

                {group.items.map((item) => {

                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        isActive
                          ? "admin-nav-link active"
                          : "admin-nav-link"
                      }
                    >

                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />

                      <span>
                        {item.label}
                      </span>

                    </NavLink>
                  );
                })}

              </div>

            </div>

          ))}

        </nav>

      </aside>
    </>
  );
};

export default AdminSidebar;