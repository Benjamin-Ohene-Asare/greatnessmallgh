import React, { useMemo, useState } from "react";
import {
  Send,
  Users,
  Search,
  MessageSquareText,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import "./AdminSms.css";

const AdminSms = () => {
  /* =========================================================
     FRONTEND-ONLY CONTACTS

     Later Django will provide real opt-in contacts.
  ========================================================= */

  const contacts = [
    {
      id: 1,
      name: "Kwame Mensah",
      phone: "+233 24 123 4567",
      status: "New",
    },
    {
      id: 2,
      name: "Akosua Owusu",
      phone: "+233 55 234 8890",
      status: "New",
    },
    {
      id: 3,
      name: "Yaw Boateng",
      phone: "+233 20 401 9921",
      status: "Contacted",
    },
    {
      id: 4,
      name: "Abena Asare",
      phone: "+233 27 777 4561",
      status: "Contacted",
    },
    {
      id: 5,
      name: "Kofi Appiah",
      phone: "+233 50 339 1102",
      status: "New",
    },
  ];

  const [audienceType, setAudienceType] =
    useState("all");

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [senderName, setSenderName] =
    useState("Greatness Mall");

  const [sendNow, setSendNow] =
    useState(true);

  const [scheduleDate, setScheduleDate] =
    useState("");

  const [scheduleTime, setScheduleTime] =
    useState("");

  const [history] = useState([
    {
      id: 1,
      message:
        "Thank you for joining Greatness Mall.",
      audience: "All Contacts",
      recipients: 24,
      status: "Sent",
      date: "06 Oct 2026",
    },
    {
      id: 2,
      message:
        "Join our upcoming product education session.",
      audience: "Selected Contacts",
      recipients: 8,
      status: "Sent",
      date: "04 Oct 2026",
    },
  ]);

  /* =========================================================
     SEARCH CONTACTS
  ========================================================= */

  const filteredContacts = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return (
        contact.name
          .toLowerCase()
          .includes(search) ||
        contact.phone
          .toLowerCase()
          .includes(search)
      );
    });
  }, [contacts, searchTerm]);

  /* =========================================================
     AUDIENCE COUNT
  ========================================================= */

  const audienceCount = useMemo(() => {
    if (audienceType === "all") {
      return contacts.length;
    }

    if (audienceType === "new") {
      return contacts.filter(
        (contact) =>
          contact.status === "New"
      ).length;
    }

    if (
      audienceType ===
      "contacted"
    ) {
      return contacts.filter(
        (contact) =>
          contact.status ===
          "Contacted"
      ).length;
    }

    if (
      audienceType ===
      "selected"
    ) {
      return selectedIds.length;
    }

    return 0;
  }, [
    audienceType,
    contacts,
    selectedIds,
  ]);

  /* =========================================================
     SMS LENGTH

     This is only a simple frontend character estimate.
     Real SMS segmentation depends on encoding and provider.
  ========================================================= */

  const characterCount =
    message.length;

  const estimatedSegments =
    message.length === 0
      ? 0
      : Math.ceil(
          message.length / 160
        );

  /* =========================================================
     CONTACT SELECTION
  ========================================================= */

  const toggleContact = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) =>
              item !== id
          )
        : [...current, id]
    );
  };

  /* =========================================================
     SEND

     Frontend simulation only.
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      window.alert(
        "Please enter an SMS message."
      );

      return;
    }

    if (audienceCount === 0) {
      window.alert(
        "Please select at least one recipient."
      );

      return;
    }

    if (
      !sendNow &&
      (!scheduleDate ||
        !scheduleTime)
    ) {
      window.alert(
        "Choose a schedule date and time."
      );

      return;
    }

    console.log({
      audienceType,
      selectedIds,
      audienceCount,
      senderName,
      message,
      sendNow,
      scheduleDate,
      scheduleTime,
    });

    window.alert(
      "Frontend only: no SMS has been sent. Django and the SMS provider will handle real delivery later."
    );
  };

  return (
    <div className="admin-sms-page">

      {/* HEADER */}

      <div className="admin-sms-header">

        <div>
          <span className="admin-sms-eyebrow">
            MARKETING
          </span>

          <h1>
            SMS Broadcast
          </h1>

          <p>
            Create and send updates to people who joined through the opt-in page.
          </p>
        </div>

      </div>


      {/* SUMMARY */}

      <div className="admin-sms-summary">

        <div className="admin-sms-summary-card">

          <div className="admin-sms-summary-icon">
            <Users
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Available Contacts
            </span>

            <strong>
              {contacts.length}
            </strong>
          </div>

        </div>


        <div className="admin-sms-summary-card">

          <div className="admin-sms-summary-icon audience">
            <Send
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Current Audience
            </span>

            <strong>
              {audienceCount}
            </strong>
          </div>

        </div>


        <div className="admin-sms-summary-card">

          <div className="admin-sms-summary-icon messages">
            <MessageSquareText
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Previous Broadcasts
            </span>

            <strong>
              {history.length}
            </strong>
          </div>

        </div>

      </div>


      <form
        className="admin-sms-layout"
        onSubmit={handleSubmit}
      >

        {/* LEFT */}

        <div className="admin-sms-main">

          {/* AUDIENCE */}

          <section className="admin-sms-card">

            <div className="admin-sms-card-heading">

              <div className="admin-sms-card-icon">
                <Users
                  size={19}
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h2>
                  Choose Audience
                </h2>

                <p>
                  Select which opt-in contacts should receive the message.
                </p>
              </div>

            </div>


            <div className="admin-sms-audience-options">

              <label
                className={
                  audienceType === "all"
                    ? "admin-sms-audience-option active"
                    : "admin-sms-audience-option"
                }
              >
                <input
                  type="radio"
                  name="audience"
                  value="all"
                  checked={
                    audienceType ===
                    "all"
                  }
                  onChange={(event) =>
                    setAudienceType(
                      event.target
                        .value
                    )
                  }
                />

                <div>
                  <strong>
                    All Contacts
                  </strong>

                  <span>
                    Send to everyone who submitted the opt-in form.
                  </span>
                </div>

              </label>


              <label
                className={
                  audienceType === "new"
                    ? "admin-sms-audience-option active"
                    : "admin-sms-audience-option"
                }
              >
                <input
                  type="radio"
                  name="audience"
                  value="new"
                  checked={
                    audienceType ===
                    "new"
                  }
                  onChange={(event) =>
                    setAudienceType(
                      event.target
                        .value
                    )
                  }
                />

                <div>
                  <strong>
                    New Contacts
                  </strong>

                  <span>
                    Send only to contacts marked as new.
                  </span>
                </div>

              </label>


              <label
                className={
                  audienceType ===
                  "contacted"
                    ? "admin-sms-audience-option active"
                    : "admin-sms-audience-option"
                }
              >
                <input
                  type="radio"
                  name="audience"
                  value="contacted"
                  checked={
                    audienceType ===
                    "contacted"
                  }
                  onChange={(event) =>
                    setAudienceType(
                      event.target
                        .value
                    )
                  }
                />

                <div>
                  <strong>
                    Contacted
                  </strong>

                  <span>
                    Send to contacts already marked as contacted.
                  </span>
                </div>

              </label>


              <label
                className={
                  audienceType ===
                  "selected"
                    ? "admin-sms-audience-option active"
                    : "admin-sms-audience-option"
                }
              >
                <input
                  type="radio"
                  name="audience"
                  value="selected"
                  checked={
                    audienceType ===
                    "selected"
                  }
                  onChange={(event) =>
                    setAudienceType(
                      event.target
                        .value
                    )
                  }
                />

                <div>
                  <strong>
                    Selected Contacts
                  </strong>

                  <span>
                    Manually choose individual recipients.
                  </span>
                </div>

              </label>

            </div>


            {audienceType ===
              "selected" && (

              <div className="admin-sms-contact-selector">

                <div className="admin-sms-contact-search">

                  <Search
                    size={16}
                    strokeWidth={1.7}
                  />

                  <input
                    type="search"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target
                          .value
                      )
                    }
                  />

                </div>


                <div className="admin-sms-contact-list">

                  {filteredContacts.map(
                    (contact) => (

                      <label
                        key={contact.id}
                        className="admin-sms-contact-row"
                      >

                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            contact.id
                          )}
                          onChange={() =>
                            toggleContact(
                              contact.id
                            )
                          }
                        />

                        <div className="admin-sms-contact-avatar">
                          {contact.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>


                        <div className="admin-sms-contact-info">

                          <strong>
                            {contact.name}
                          </strong>

                          <span>
                            {contact.phone}
                          </span>

                        </div>


                        <span className="admin-sms-contact-status">
                          {contact.status}
                        </span>

                      </label>

                    )
                  )}

                </div>

              </div>

            )}

          </section>


          {/* MESSAGE */}

          <section className="admin-sms-card">

            <div className="admin-sms-card-heading">

              <div className="admin-sms-card-icon">
                <MessageSquareText
                  size={19}
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h2>
                  Message
                </h2>

                <p>
                  Write the SMS that should be sent to the selected audience.
                </p>
              </div>

            </div>


            <div className="admin-sms-field">

              <label htmlFor="sender-name">
                Sender Name
              </label>

              <input
                id="sender-name"
                type="text"
                value={senderName}
                onChange={(event) =>
                  setSenderName(
                    event.target.value
                  )
                }
                maxLength={30}
                placeholder="Greatness Mall"
              />

              <small>
                The real sender ID must later be approved by the SMS provider where required.
              </small>

            </div>


            <div className="admin-sms-field">

              <label htmlFor="sms-message">
                SMS Message
                <span>*</span>
              </label>

              <textarea
                id="sms-message"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                rows="8"
                maxLength={600}
                placeholder="Write your message..."
                required
              />


              <div className="admin-sms-message-helper">

                <span>
                  {characterCount}/600 characters
                </span>

                <span>
                  Approx. {estimatedSegments} SMS segment
                  {estimatedSegments === 1
                    ? ""
                    : "s"}
                </span>

              </div>

            </div>

          </section>


          {/* DELIVERY */}

          <section className="admin-sms-card">

            <div className="admin-sms-card-heading">

              <div className="admin-sms-card-icon">
                <Clock3
                  size={19}
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h2>
                  Delivery
                </h2>

                <p>
                  Send immediately or prepare the message for a future time.
                </p>
              </div>

            </div>


            <div className="admin-sms-delivery-options">

              <label
                className={
                  sendNow
                    ? "admin-sms-delivery-option active"
                    : "admin-sms-delivery-option"
                }
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={sendNow}
                  onChange={() =>
                    setSendNow(true)
                  }
                />

                <div>
                  <strong>
                    Send Now
                  </strong>

                  <span>
                    Send immediately after confirmation.
                  </span>
                </div>

              </label>


              <label
                className={
                  !sendNow
                    ? "admin-sms-delivery-option active"
                    : "admin-sms-delivery-option"
                }
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={!sendNow}
                  onChange={() =>
                    setSendNow(false)
                  }
                />

                <div>
                  <strong>
                    Schedule
                  </strong>

                  <span>
                    Choose a future date and time.
                  </span>
                </div>

              </label>

            </div>


            {!sendNow && (

              <div className="admin-sms-schedule-grid">

                <div className="admin-sms-field">

                  <label htmlFor="sms-date">
                    Date
                  </label>

                  <input
                    id="sms-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(event) =>
                      setScheduleDate(
                        event.target
                          .value
                      )
                    }
                  />

                </div>


                <div className="admin-sms-field">

                  <label htmlFor="sms-time">
                    Time
                  </label>

                  <input
                    id="sms-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(event) =>
                      setScheduleTime(
                        event.target
                          .value
                      )
                    }
                  />

                </div>

              </div>

            )}

          </section>

        </div>


        {/* RIGHT SIDEBAR */}

        <aside className="admin-sms-sidebar">

          <div className="admin-sms-preview-card">

            <div className="admin-sms-preview-heading">

              <div>
                <span>
                  MESSAGE PREVIEW
                </span>

                <h2>
                  SMS Preview
                </h2>
              </div>

              <MessageSquareText
                size={18}
                strokeWidth={1.7}
              />

            </div>


            <div className="admin-sms-phone-preview">

              <div className="admin-sms-phone-header">

                <div className="admin-sms-phone-avatar">
                  G
                </div>

                <div>
                  <strong>
                    {senderName ||
                      "Greatness Mall"}
                  </strong>

                  <span>
                    SMS
                  </span>
                </div>

              </div>


              <div className="admin-sms-bubble">
                {message ||
                  "Your SMS message will appear here."}
              </div>

            </div>


            <div className="admin-sms-send-summary">

              <div>
                <span>
                  Audience
                </span>

                <strong>
                  {audienceCount} recipients
                </strong>
              </div>


              <div>
                <span>
                  Delivery
                </span>

                <strong>
                  {sendNow
                    ? "Send now"
                    : "Scheduled"}
                </strong>
              </div>


              <div>
                <span>
                  Approx. SMS
                </span>

                <strong>
                  {estimatedSegments} segment
                  {estimatedSegments === 1
                    ? ""
                    : "s"} per recipient
                </strong>
              </div>

            </div>


            <button
              type="submit"
              className="admin-sms-send-button"
            >
              <Send
                size={17}
                strokeWidth={1.8}
              />

              {sendNow
                ? "Send Broadcast"
                : "Schedule Broadcast"}
            </button>


            <div className="admin-sms-warning">

              <AlertCircle
                size={16}
                strokeWidth={1.7}
              />

              <p>
                Frontend preview only. This button does not send real SMS yet.
              </p>

            </div>

          </div>

        </aside>

      </form>


      {/* BROADCAST HISTORY */}

      <section className="admin-sms-history-section">

        <div className="admin-sms-history-heading">

          <div>
            <h2>
              Broadcast History
            </h2>

            <p>
              Previous SMS campaigns will appear here.
            </p>
          </div>

        </div>


        <div className="admin-sms-history-table-card">

          <div className="admin-sms-history-scroll">

            <table className="admin-sms-history-table">

              <thead>
                <tr>
                  <th>Message</th>
                  <th>Audience</th>
                  <th>Recipients</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>


              <tbody>

                {history.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <strong>
                        {item.message}
                      </strong>
                    </td>

                    <td>
                      {item.audience}
                    </td>

                    <td>
                      {item.recipients}
                    </td>

                    <td>

                      <span className="admin-sms-history-status">
                        <CheckCircle2
                          size={13}
                          strokeWidth={1.8}
                        />

                        {item.status}
                      </span>

                    </td>

                    <td>
                      {item.date}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  );
};

export default AdminSms;