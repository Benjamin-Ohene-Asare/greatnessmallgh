import React, { useMemo, useState } from "react";
import {
  Search,
  Users,
  Mail,
  Phone,
  CalendarDays,
  Download,
  Send,
  Eye,
  Trash2,
  CheckSquare,
  X,
} from "lucide-react";

import "./AdminContacts.css";

const AdminContacts = () => {
  /* =========================================================
     FRONTEND-ONLY OPT-IN SUBMISSIONS

     Later Django will provide:
     - real submissions
     - pagination
     - filters
     - campaign/resource source
     - timestamps
     - export
     - SMS audience selection
     - admin permissions

     SECURITY:
     Contact information is sensitive business data.
     Real access must be restricted by Django authentication
     and authorization later.
  ========================================================= */

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Kwame Mensah",
      phone: "+233 24 123 4567",
      email: "kwame@example.com",
      resource: "Greatness Mall Wellness Guide",
      submittedAt: "07 Oct 2026",
      status: "New",
    },
    {
      id: 2,
      name: "Akosua Owusu",
      phone: "+233 55 234 8890",
      email: "akosua@example.com",
      resource: "Greatness Mall Wellness Guide",
      submittedAt: "07 Oct 2026",
      status: "New",
    },
    {
      id: 3,
      name: "Yaw Boateng",
      phone: "+233 20 401 9921",
      email: "",
      resource: "Greatness Mall Wellness Guide",
      submittedAt: "06 Oct 2026",
      status: "Contacted",
    },
    {
      id: 4,
      name: "Abena Asare",
      phone: "+233 27 777 4561",
      email: "abena@example.com",
      resource: "Greatness Mall Wellness Guide",
      submittedAt: "06 Oct 2026",
      status: "Contacted",
    },
    {
      id: 5,
      name: "Kofi Appiah",
      phone: "+233 50 339 1102",
      email: "kofi@example.com",
      resource: "Greatness Mall Wellness Guide",
      submittedAt: "05 Oct 2026",
      status: "New",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewContact, setViewContact] = useState(null);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredContacts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch =
        !search ||
        contact.name.toLowerCase().includes(search) ||
        contact.phone.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.resource.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const allVisibleSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((contact) =>
      selectedIds.includes(contact.id)
    );

  /* =========================================================
     SELECT CONTACT
  ========================================================= */

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = filteredContacts.map(
        (contact) => contact.id
      );

      setSelectedIds((current) =>
        current.filter(
          (id) => !visibleIds.includes(id)
        )
      );

      return;
    }

    const visibleIds = filteredContacts.map(
      (contact) => contact.id
    );

    setSelectedIds((current) => [
      ...new Set([...current, ...visibleIds]),
    ]);
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const markAsContacted = (id) => {
    setContacts((current) =>
      current.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              status: "Contacted",
            }
          : contact
      )
    );

    setViewContact((current) =>
      current?.id === id
        ? {
            ...current,
            status: "Contacted",
          }
        : current
    );
  };

  /* =========================================================
     DELETE

     Frontend only.
  ========================================================= */

  const deleteContact = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this opt-in submission?"
    );

    if (!confirmed) {
      return;
    }

    setContacts((current) =>
      current.filter(
        (contact) => contact.id !== id
      )
    );

    setSelectedIds((current) =>
      current.filter(
        (selectedId) => selectedId !== id
      )
    );

    setViewContact(null);
  };

  return (
    <div className="admin-contacts-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="admin-contacts-header">

        <div>
          <span className="admin-contacts-eyebrow">
            MARKETING
          </span>

          <h1>
            Opt-In Submissions
          </h1>

          <p>
            View people who submitted the opt-in form and manage them for future communication.
          </p>
        </div>


        <div className="admin-contacts-header-actions">

          <button
            type="button"
            className="admin-contacts-export-button"
          >
            <Download size={17} strokeWidth={1.8} />

            Export
          </button>


          <button
            type="button"
            className="admin-contacts-sms-button"
            disabled={selectedIds.length === 0}
          >
            <Send size={17} strokeWidth={1.8} />

            Send SMS
            {selectedIds.length > 0 &&
              ` (${selectedIds.length})`}
          </button>

        </div>

      </div>


      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="admin-contacts-summary">

        <div className="admin-contact-summary-card">

          <div className="admin-contact-summary-icon">
            <Users size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span>
              Total Submissions
            </span>

            <strong>
              {contacts.length}
            </strong>
          </div>

        </div>


        <div className="admin-contact-summary-card">

          <div className="admin-contact-summary-icon new">
            <Mail size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span>
              New
            </span>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    contact.status === "New"
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="admin-contact-summary-card">

          <div className="admin-contact-summary-icon contacted">
            <CheckSquare size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span>
              Contacted
            </span>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    contact.status === "Contacted"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="admin-contacts-toolbar">

        <div className="admin-contacts-search">

          <Search
            size={17}
            strokeWidth={1.7}
          />

          <input
            type="search"
            placeholder="Search name, phone or email..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>


        <select
          className="admin-contacts-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="New">
            New
          </option>

          <option value="Contacted">
            Contacted
          </option>
        </select>

      </div>


      {/* =====================================================
          SELECTED BAR
      ====================================================== */}

      {selectedIds.length > 0 && (

        <div className="admin-contacts-selected-bar">

          <div>
            <CheckSquare
              size={17}
              strokeWidth={1.7}
            />

            <span>
              {selectedIds.length} contact
              {selectedIds.length !== 1
                ? "s"
                : ""} selected
            </span>
          </div>


          <button
            type="button"
            onClick={() =>
              setSelectedIds([])
            }
          >
            Clear Selection
          </button>

        </div>

      )}


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="admin-contacts-table-card">

        {filteredContacts.length > 0 ? (

          <div className="admin-contacts-table-scroll">

            <table className="admin-contacts-table">

              <thead>
                <tr>

                  <th className="admin-contact-checkbox-column">

                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all visible contacts"
                    />

                  </th>

                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Resource</th>
                  <th>Date</th>
                  <th>Status</th>

                  <th className="admin-contact-actions-heading">
                    Actions
                  </th>

                </tr>
              </thead>


              <tbody>

                {filteredContacts.map(
                  (contact) => (

                    <tr key={contact.id}>

                      <td className="admin-contact-checkbox-column">

                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            contact.id
                          )}
                          onChange={() =>
                            toggleSelect(
                              contact.id
                            )
                          }
                          aria-label={`Select ${contact.name}`}
                        />

                      </td>


                      <td>

                        <div className="admin-contact-name-cell">

                          <div className="admin-contact-avatar">
                            {contact.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {contact.name}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <div className="admin-contact-detail-cell">

                          <Phone
                            size={14}
                            strokeWidth={1.7}
                          />

                          <span>
                            {contact.phone}
                          </span>

                        </div>

                      </td>


                      <td>

                        <div className="admin-contact-detail-cell">

                          <Mail
                            size={14}
                            strokeWidth={1.7}
                          />

                          <span>
                            {contact.email || "—"}
                          </span>

                        </div>

                      </td>


                      <td>
                        {contact.resource}
                      </td>


                      <td>

                        <div className="admin-contact-detail-cell">

                          <CalendarDays
                            size={14}
                            strokeWidth={1.7}
                          />

                          <span>
                            {contact.submittedAt}
                          </span>

                        </div>

                      </td>


                      <td>

                        <span
                          className={
                            contact.status === "New"
                              ? "admin-contact-status new"
                              : "admin-contact-status contacted"
                          }
                        >
                          {contact.status}
                        </span>

                      </td>


                      <td>

                        <div className="admin-contact-row-actions">

                          <button
                            type="button"
                            className="admin-contact-icon-button"
                            onClick={() =>
                              setViewContact(
                                contact
                              )
                            }
                            aria-label={`View ${contact.name}`}
                          >
                            <Eye
                              size={16}
                              strokeWidth={1.7}
                            />
                          </button>


                          <button
                            type="button"
                            className="admin-contact-icon-button danger"
                            onClick={() =>
                              deleteContact(
                                contact.id
                              )
                            }
                            aria-label={`Delete ${contact.name}`}
                          >
                            <Trash2
                              size={16}
                              strokeWidth={1.7}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="admin-contacts-empty">

            <Users
              size={36}
              strokeWidth={1.5}
            />

            <h2>
              No submissions found
            </h2>

            <p>
              Try changing your search or filter.
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          CONTACT DETAILS MODAL
      ====================================================== */}

      {viewContact && (

        <div className="admin-contact-modal-overlay">

          <div
            className="admin-contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >

            <div className="admin-contact-modal-header">

              <div>

                <span>
                  OPT-IN SUBMISSION
                </span>

                <h2 id="contact-modal-title">
                  Contact Details
                </h2>

              </div>


              <button
                type="button"
                className="admin-contact-modal-close"
                onClick={() =>
                  setViewContact(null)
                }
                aria-label="Close contact details"
              >
                <X
                  size={19}
                  strokeWidth={1.7}
                />
              </button>

            </div>


            <div className="admin-contact-modal-body">

              <div className="admin-contact-modal-person">

                <div className="admin-contact-modal-avatar">
                  {viewContact.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    {viewContact.name}
                  </h3>

                  <span
                    className={
                      viewContact.status === "New"
                        ? "admin-contact-status new"
                        : "admin-contact-status contacted"
                    }
                  >
                    {viewContact.status}
                  </span>
                </div>

              </div>


              <div className="admin-contact-modal-grid">

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {viewContact.phone}
                  </strong>
                </div>


                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {viewContact.email ||
                      "Not provided"}
                  </strong>
                </div>


                <div>
                  <span>
                    Resource
                  </span>

                  <strong>
                    {viewContact.resource}
                  </strong>
                </div>


                <div>
                  <span>
                    Submitted
                  </span>

                  <strong>
                    {viewContact.submittedAt}
                  </strong>
                </div>

              </div>

            </div>


            <div className="admin-contact-modal-actions">

              {viewContact.status === "New" && (

                <button
                  type="button"
                  className="admin-contact-mark-button"
                  onClick={() =>
                    markAsContacted(
                      viewContact.id
                    )
                  }
                >
                  Mark as Contacted
                </button>

              )}


              <button
                type="button"
                className="admin-contact-modal-sms-button"
              >
                <Send
                  size={16}
                  strokeWidth={1.7}
                />

                Send SMS
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminContacts;