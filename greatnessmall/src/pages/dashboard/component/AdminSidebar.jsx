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
          tourId: "dashboard",
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
          tourId: "products",
        },
        {
          label: "Categories",
          path: "/admin/categories",
          icon: Tags,
          tourId: "categories",
        },
        {
          label: "Events",
          path: "/admin/events",
          icon: CalendarDays,
          tourId: "events",
        },
        {
          label: "Twi Content",
          path: "/admin/twi",
          icon: Languages,
          tourId: "twi",
        },
        {
          label: "FAQs",
          path: "/admin/faq",
          icon: CircleHelp,
          tourId: "faqs",
        },
        {
          label: "Testimonials",
          path: "/admin/testimonials",
          icon: MessageSquareQuote,
          tourId: "testimonials",
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
          tourId: "optin",
        },
        {
          label: "Contacts",
          path: "/admin/contacts",
          icon: Users,
          tourId: "contacts",
        },
        {
          label: "SMS Broadcast",
          path: "/admin/sms",
          icon: Send,
          tourId: "sms",
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
          tourId: "whatsapp",
        },
        {
          label: "Website Settings",
          path: "/admin/settings",
          icon: Settings,
          tourId: "settings",
        },
      ],
    },
  ];

  return (
    <>
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
                      data-tour={item.tourId}
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