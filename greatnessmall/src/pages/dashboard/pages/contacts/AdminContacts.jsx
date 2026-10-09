import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Users,
  Mail,
  Phone,
  CalendarDays,
  Download,
  Send,
  Eye,
  CheckSquare,
  X,
} from "lucide-react";

import {
  getAdminOptInSubmissions,
  updateAdminOptInSubmission,
} from "../../../../services/backend";

import "./AdminContacts.css";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};


const mapSubmission = (
  submission
) => ({
  id: submission.id,

  name:
    submission.full_name || "",

  phone:
    submission.phone || "",

  email:
    submission.email || "",

  resource:
    submission.campaign_title ||
    "Greatness Mall Resource",

  submittedAt:
    submission.submitted_at,

  lastAccessedAt:
    submission.last_accessed_at,

  status:
    submission.status === "contacted"
      ? "Contacted"
      : "New",

  statusValue:
    submission.status || "new",
});


const AdminContacts = () => {
  const navigate = useNavigate();
  const [
    contacts,
    setContacts,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedIds,
    setSelectedIds,
  ] = useState([]);

  const [
    viewContact,
    setViewContact,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);


  // Load real opt-in submissions
  useEffect(() => {
    let active = true;

    const loadContacts = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminOptInSubmissions();

        if (!active) {
          return;
        }

        const results =
          Array.isArray(data)
            ? data
            : data.results || [];

        setContacts(
          results.map(
            mapSubmission
          )
        );
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError.message ||
          "Unable to load opt-in submissions."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      active = false;
    };
  }, []);


  const filteredContacts =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return contacts.filter(
        (contact) => {
          const matchesSearch =
            !search ||
            contact.name
              .toLowerCase()
              .includes(search) ||
            contact.phone
              .toLowerCase()
              .includes(search) ||
            contact.email
              .toLowerCase()
              .includes(search) ||
            contact.resource
              .toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter === "All" ||
            contact.status ===
            statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      contacts,
      searchTerm,
      statusFilter,
    ]);


  const allVisibleSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every(
      (contact) =>
        selectedIds.includes(
          contact.id
        )
    );


  const toggleSelect = (id) => {
    setSelectedIds(
      (current) =>
        current.includes(id)
          ? current.filter(
            (item) =>
              item !== id
          )
          : [
            ...current,
            id,
          ]
    );
  };


  const toggleSelectAll = () => {
    const visibleIds =
      filteredContacts.map(
        (contact) =>
          contact.id
      );

    if (allVisibleSelected) {
      setSelectedIds(
        (current) =>
          current.filter(
            (id) =>
              !visibleIds.includes(
                id
              )
          )
      );

      return;
    }

    setSelectedIds(
      (current) => [
        ...new Set([
          ...current,
          ...visibleIds,
        ]),
      ]
    );
  };


  const markAsContacted =
    async (id) => {
      try {
        setUpdatingId(id);
        setError("");

        const updated =
          await updateAdminOptInSubmission(
            id,
            {
              status:
                "contacted",
            }
          );

        const mapped =
          mapSubmission(
            updated
          );

        setContacts(
          (current) =>
            current.map(
              (contact) =>
                contact.id === id
                  ? mapped
                  : contact
            )
        );

        setViewContact(
          (current) =>
            current?.id === id
              ? mapped
              : current
        );
      } catch (requestError) {
        setError(
          requestError.message ||
          "Unable to update the contact."
        );
      } finally {
        setUpdatingId(null);
      }
    };


  const exportContacts = () => {
    if (
      contacts.length === 0
    ) {
      return;
    }

    const escapeCsv = (
      value
    ) => {
      const text =
        String(
          value ?? ""
        );

      return `"${text.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = [
      [
        "Name",
        "Phone",
        "Email",
        "Resource",
        "Submitted",
        "Status",
      ],

      ...contacts.map(
        (contact) => [
          contact.name,
          contact.phone,
          contact.email,
          contact.resource,
          formatDate(
            contact.submittedAt
          ),
          contact.status,
        ]
      ),
    ];

    const csv = rows
      .map(
        (row) =>
          row
            .map(
              escapeCsv
            )
            .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      "greatness-mall-opt-in-submissions.csv";

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(
      url
    );
  };


  return (
    <div className="admin-contacts-page">
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
            onClick={
              exportContacts
            }
            disabled={
              contacts.length ===
              0
            }
          >
            <Download
              size={17}
              strokeWidth={1.8}
            />

            Export
          </button>

          <button
            type="button"
            className="admin-contacts-sms-button"
            onClick={() => navigate("/admin/sms")}
          >
            <Send size={17} strokeWidth={1.8} />
            Send SMS
          </button>
        </div>
      </div>


      {error && (
        <div
          role="alert"
          className="admin-contacts-error"
        >
          {error}
        </div>
      )}


      <div className="admin-contacts-summary">
        <div className="admin-contact-summary-card">
          <div className="admin-contact-summary-icon">
            <Users
              size={19}
              strokeWidth={1.7}
            />
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
            <Mail
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              New
            </span>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    contact.status ===
                    "New"
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="admin-contact-summary-card">
          <div className="admin-contact-summary-icon contacted">
            <CheckSquare
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Contacted
            </span>

            <strong>
              {
                contacts.filter(
                  (contact) =>
                    contact.status ===
                    "Contacted"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>


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
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <select
          className="admin-contacts-filter"
          value={statusFilter}
          onChange={(
            event
          ) =>
            setStatusFilter(
              event.target.value
            )
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


      {selectedIds.length >
        0 && (
          <div className="admin-contacts-selected-bar">
            <div>
              <CheckSquare
                size={17}
                strokeWidth={1.7}
              />

              <span>
                {selectedIds.length}{" "}
                contact
                {selectedIds.length !==
                  1
                  ? "s"
                  : ""}{" "}
                selected
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedIds(
                  []
                )
              }
            >
              Clear Selection
            </button>
          </div>
        )}


      <div className="admin-contacts-table-card">
        {loading ? (
          <div className="admin-contacts-empty">
            <Users
              size={36}
              strokeWidth={1.5}
            />

            <h2>
              Loading submissions
            </h2>

            <p>
              Please wait while the contacts are loaded.
            </p>
          </div>
        ) : filteredContacts.length >
          0 ? (
          <div className="admin-contacts-table-scroll">
            <table className="admin-contacts-table">
              <thead>
                <tr>
                  <th className="admin-contact-checkbox-column">
                    <input
                      type="checkbox"
                      checked={
                        allVisibleSelected
                      }
                      onChange={
                        toggleSelectAll
                      }
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
                    <tr
                      key={
                        contact.id
                      }
                    >
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
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <strong>
                            {
                              contact.name
                            }
                          </strong>
                        </div>
                      </td>

                      <td>
                        <div className="admin-contact-detail-cell">
                          <Phone
                            size={
                              14
                            }
                            strokeWidth={
                              1.7
                            }
                          />

                          <span>
                            {
                              contact.phone
                            }
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-contact-detail-cell">
                          <Mail
                            size={
                              14
                            }
                            strokeWidth={
                              1.7
                            }
                          />

                          <span>
                            {contact.email ||
                              "—"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {
                          contact.resource
                        }
                      </td>

                      <td>
                        <div className="admin-contact-detail-cell">
                          <CalendarDays
                            size={
                              14
                            }
                            strokeWidth={
                              1.7
                            }
                          />

                          <span>
                            {formatDate(
                              contact.submittedAt
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            contact.status ===
                              "New"
                              ? "admin-contact-status new"
                              : "admin-contact-status contacted"
                          }
                        >
                          {
                            contact.status
                          }
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
                              size={
                                16
                              }
                              strokeWidth={
                                1.7
                              }
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
              {contacts.length ===
                0
                ? "No one has submitted the opt-in form yet."
                : "Try changing your search or filter."}
            </p>
          </div>
        )}
      </div>


      {viewContact && (
        <div
          className="admin-contact-modal-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setViewContact(
                null
              );
            }
          }}
        >
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
                  setViewContact(
                    null
                  )
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
                    {
                      viewContact.name
                    }
                  </h3>

                  <span
                    className={
                      viewContact.status ===
                        "New"
                        ? "admin-contact-status new"
                        : "admin-contact-status contacted"
                    }
                  >
                    {
                      viewContact.status
                    }
                  </span>
                </div>
              </div>


              <div className="admin-contact-modal-grid">
                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {
                      viewContact.phone
                    }
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
                    {
                      viewContact.resource
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Submitted
                  </span>

                  <strong>
                    {formatDate(
                      viewContact.submittedAt
                    )}
                  </strong>
                </div>
              </div>
            </div>


            <div className="admin-contact-modal-actions">
              {viewContact.status ===
                "New" && (
                  <button
                    type="button"
                    className="admin-contact-mark-button"
                    disabled={
                      updatingId ===
                      viewContact.id
                    }
                    onClick={() =>
                      markAsContacted(
                        viewContact.id
                      )
                    }
                  >
                    {updatingId ===
                      viewContact.id
                      ? "Updating..."
                      : "Mark as Contacted"}
                  </button>
                )}

              <button
                type="button"
                className="admin-contact-modal-sms-button"
                onClick={() => navigate("/admin/sms")}
              >
                <Send size={16} strokeWidth={1.7} />
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