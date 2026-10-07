import React from "react";
import {
  Package,
  CalendarDays,
  Users,
  Languages,
  CircleHelp,
  MessageSquareQuote,
  Plus,
  Send,
  ArrowRight,
} from "lucide-react";

import AdminStatCard from "../../component/AdminStatCard";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  /* =========================================================
     TEMPORARY FRONTEND DATA

     Later Django will provide all dashboard statistics
     and recent activity from the database.

     SECURITY:
     These numbers are display-only placeholders.
     Real admin statistics must come from authenticated
     Django endpoints later.
  ========================================================= */

  const stats = [
    {
      id: 1,
      title: "Products",
      value: "6",
      description: "Products currently listed",
      icon: Package,
    },
    {
      id: 2,
      title: "Upcoming Events",
      value: "1",
      description: "Published upcoming program",
      icon: CalendarDays,
    },
    {
      id: 3,
      title: "Opt-In Contacts",
      value: "24",
      description: "People who joined through the opt-in page",
      icon: Users,
    },
    {
      id: 4,
      title: "Twi Content",
      value: "8",
      description: "Videos, audio and images",
      icon: Languages,
    },
    {
      id: 5,
      title: "FAQs",
      value: "8",
      description: "Published frequently asked questions",
      icon: CircleHelp,
    },
    {
      id: 6,
      title: "Testimonials",
      value: "5",
      description: "Video, image and audio testimonials",
      icon: MessageSquareQuote,
    },
  ];

  const recentContacts = [
    {
      id: 1,
      name: "Kwame Mensah",
      phone: "+233 24 123 4567",
      email: "kwame@example.com",
      resource: "Greatness Mall Guide",
      date: "07 Oct 2026",
    },
    {
      id: 2,
      name: "Akosua Owusu",
      phone: "+233 55 234 8890",
      email: "akosua@example.com",
      resource: "Greatness Mall Guide",
      date: "07 Oct 2026",
    },
    {
      id: 3,
      name: "Yaw Boateng",
      phone: "+233 20 401 9921",
      email: "—",
      resource: "Greatness Mall Guide",
      date: "06 Oct 2026",
    },
    {
      id: 4,
      name: "Abena Asare",
      phone: "+233 27 777 4561",
      email: "abena@example.com",
      resource: "Greatness Mall Guide",
      date: "06 Oct 2026",
    },
  ];

  return (
    <div className="admin-dashboard-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="admin-dashboard-header">

        <div>

          <span className="admin-dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Manage Greatness Mall content and see recent activity.
          </p>

        </div>


        <div className="admin-dashboard-header-actions">

          <button
            type="button"
            className="admin-header-secondary-button"
          >
            <Send
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Send SMS
          </button>

          <button
            type="button"
            className="admin-header-primary-button"
          >
            <Plus
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Add Product
          </button>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section
        className="admin-stats-grid"
        aria-label="Dashboard statistics"
      >

        {stats.map((stat) => (
          <AdminStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="admin-dashboard-section">

        <div className="admin-section-header">

          <div>
            <h2>
              Quick Actions
            </h2>

            <p>
              Common tasks for managing the website.
            </p>
          </div>

        </div>


        <div className="admin-quick-actions-grid">

          <button
            type="button"
            className="admin-quick-action"
          >
            <div className="admin-quick-action-icon">
              <Package
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>
                Add Product
              </strong>

              <span>
                Create a new product and its details.
              </span>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>


          <button
            type="button"
            className="admin-quick-action"
          >
            <div className="admin-quick-action-icon">
              <CalendarDays
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>
                Add Event
              </strong>

              <span>
                Publish a new program or training event.
              </span>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>


          <button
            type="button"
            className="admin-quick-action"
          >
            <div className="admin-quick-action-icon">
              <Languages
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>
                Add Twi Content
              </strong>

              <span>
                Add a Twi video, audio or image.
              </span>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>


          <button
            type="button"
            className="admin-quick-action"
          >
            <div className="admin-quick-action-icon">
              <Send
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>
                Send SMS
              </strong>

              <span>
                Prepare a broadcast for opt-in contacts.
              </span>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>

        </div>

      </section>


      {/* =====================================================
          RECENT CONTACTS
      ====================================================== */}

      <section className="admin-dashboard-section">

        <div className="admin-section-header">

          <div>
            <h2>
              Recent Opt-In Contacts
            </h2>

            <p>
              Latest people who submitted the opt-in form.
            </p>
          </div>

          <button
            type="button"
            className="admin-text-button"
          >
            View All

            <ArrowRight
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>

        </div>


        <div className="admin-table-card">

          <div className="admin-table-scroll">

            <table className="admin-dashboard-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Resource</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {recentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <strong>
                        {contact.name}
                      </strong>
                    </td>

                    <td>
                      {contact.phone}
                    </td>

                    <td>
                      {contact.email}
                    </td>

                    <td>
                      {contact.resource}
                    </td>

                    <td>
                      {contact.date}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* =====================================================
          FRONTEND STATUS NOTE
      ====================================================== */}

      <section className="admin-dashboard-note">

        <strong>
          Frontend Preview
        </strong>

        <p>
          Dashboard actions are currently visual only. Product publishing,
          contacts, SMS broadcasting, uploads and authentication will become
          functional after the Django backend is connected.
        </p>

      </section>

    </div>
  );
};

export default AdminDashboard;