import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import {
  getAdminProducts,
  getAdminEvents,
  getAdminOptInSubmissions,
  getAdminTwiContent,
  getAdminFaqs,
  getAdminTestimonials,
} from "../../../../services/backend";

import "./AdminDashboard.css";

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    products: 0,
    events: 0,
    contacts: 0,
    twi: 0,
    faqs: 0,
    testimonials: 0,
  });

  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [
          productsData,
          eventsData,
          contactsData,
          twiData,
          faqsData,
          testimonialsData,
        ] = await Promise.all([
          getAdminProducts(),
          getAdminEvents(),
          getAdminOptInSubmissions(),
          getAdminTwiContent(),
          getAdminFaqs(),
          getAdminTestimonials(),
        ]);

        if (!active) return;

        const products = toArray(productsData);
        const events = toArray(eventsData);
        const contacts = toArray(contactsData);
        const twi = toArray(twiData);
        const faqs = toArray(faqsData);
        const testimonials = toArray(testimonialsData);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = events.filter((event) => {
          if (!event.date) {
            return false;
          }

          const eventDate = new Date(
            `${event.date}T00:00:00`
          );

          if (Number.isNaN(eventDate.getTime())) {
            return false;
          }

          return (
            event.published === true &&
            eventDate >= today
          );
        });

        setDashboardData({
          products: products.length,
          events: upcomingEvents.length,
          contacts: contacts.length,
          twi: twi.length,
          faqs: faqs.length,
          testimonials: testimonials.length,
        });

        setRecentContacts(
          contacts.slice(0, 4)
        );
      } catch (error) {
        if (!active) return;

        console.error(
          "Unable to load dashboard:",
          error
        );

        setLoadError(
          error.message ||
            "Unable to load dashboard information."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      id: 1,
      title: "Products",
      value: loading
        ? "—"
        : dashboardData.products,
      description: "Products currently listed",
      icon: Package,
    },
    {
      id: 2,
      title: "Upcoming Events",
      value: loading
        ? "—"
        : dashboardData.events,
      description: "Published upcoming programs",
      icon: CalendarDays,
    },
    {
      id: 3,
      title: "Opt-In Contacts",
      value: loading
        ? "—"
        : dashboardData.contacts,
      description:
        "People who joined through the opt-in page",
      icon: Users,
    },
    {
      id: 4,
      title: "Twi Content",
      value: loading
        ? "—"
        : dashboardData.twi,
      description: "Videos, audio and images",
      icon: Languages,
    },
    {
      id: 5,
      title: "FAQs",
      value: loading
        ? "—"
        : dashboardData.faqs,
      description: "Frequently asked questions",
      icon: CircleHelp,
    },
    {
      id: 6,
      title: "Testimonials",
      value: loading
        ? "—"
        : dashboardData.testimonials,
      description:
        "Video, image and audio testimonials",
      icon: MessageSquareQuote,
    },
  ];

  return (
    <div className="admin-dashboard-page">
      <section className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>Dashboard</h1>

          <p>
            Manage Greatness Mall content and see
            recent activity.
          </p>
        </div>

        <div className="admin-dashboard-header-actions">
          <button
            type="button"
            className="admin-header-secondary-button"
            onClick={() =>
              navigate("/admin/sms")
            }
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
            onClick={() =>
              navigate("/admin/products/add")
            }
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

      {loadError && (
        <div
          className="admin-dashboard-error"
          role="alert"
        >
          {loadError}
        </div>
      )}

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

      <section className="admin-dashboard-section">
        <div className="admin-section-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Common tasks for managing the website.
            </p>
          </div>
        </div>

        <div className="admin-quick-actions-grid">
          <button
            type="button"
            className="admin-quick-action"
            onClick={() =>
              navigate("/admin/products/add")
            }
          >
            <div className="admin-quick-action-icon">
              <Package
                size={20}
                strokeWidth={1.7}
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
            />
          </button>

          <button
            type="button"
            className="admin-quick-action"
            onClick={() =>
              navigate("/admin/events/add")
            }
          >
            <div className="admin-quick-action-icon">
              <CalendarDays
                size={20}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <strong>
                Add Event
              </strong>

              <span>
                Publish a new program or training
                event.
              </span>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.7}
            />
          </button>

          <button
            type="button"
            className="admin-quick-action"
            onClick={() =>
              navigate("/admin/twi")
            }
          >
            <div className="admin-quick-action-icon">
              <Languages
                size={20}
                strokeWidth={1.7}
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
            />
          </button>

          <button
            type="button"
            className="admin-quick-action"
            onClick={() =>
              navigate("/admin/sms")
            }
          >
            <div className="admin-quick-action-icon">
              <Send
                size={20}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <strong>
                Send SMS
              </strong>

              <span>
                Prepare a broadcast for opt-in
                contacts.
              </span>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-section-header">
          <div>
            <h2>
              Recent Opt-In Contacts
            </h2>

            <p>
              Latest people who submitted the
              opt-in form.
            </p>
          </div>

          <button
            type="button"
            className="admin-text-button"
            onClick={() =>
              navigate("/admin/contacts")
            }
          >
            View All

            <ArrowRight
              size={15}
              strokeWidth={1.7}
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
                {!loading &&
                recentContacts.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      No opt-in contacts yet.
                    </td>
                  </tr>
                ) : (
                  recentContacts.map(
                    (contact) => (
                      <tr key={contact.id}>
                        <td>
                          <strong>
                            {contact.full_name}
                          </strong>
                        </td>

                        <td>
                          {contact.phone || "—"}
                        </td>

                        <td>
                          {contact.email || "—"}
                        </td>

                        <td>
                          {contact.campaign_title ||
                            "Greatness Mall Resource"}
                        </td>

                        <td>
                          {formatDate(
                            contact.submitted_at
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;