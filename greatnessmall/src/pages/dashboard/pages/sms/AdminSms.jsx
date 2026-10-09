import React, { useEffect, useState } from "react";
import {
  MessageSquareText,
  Send,
  User,
  Users,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getAdminSMSCustomers,
  sendAdminSMSBroadcast,
  sendAdminSMSToContact,
} from "../../../../services/backend";

import "./AdminSms.css";

const AdminSms = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedContact =
    location.state?.contactId
      ? location.state
      : null;

  const singleContactMode =
    Boolean(selectedContact);

  const [message, setMessage] = useState("");
  const [customerCount, setCustomerCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCustomers = async () => {
      try {
        setLoading(true);

        const data = await getAdminSMSCustomers();

        if (!active) return;

        setCustomerCount(
          data.customer_count || 0
        );
      } catch (error) {
        if (!active) return;

        setFeedback(
          error.message ||
            "Unable to load customer information."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      active = false;
    };
  }, []);

  const clearSelectedContact = () => {
    navigate("/admin/sms", {
      replace: true,
      state: null,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      setFeedback(
        "Write a message before sending."
      );
      return;
    }

    if (
      !singleContactMode &&
      customerCount === 0
    ) {
      setFeedback(
        "There are no customers to send SMS to."
      );
      return;
    }

    setFeedback("");
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    const cleanMessage = message.trim();

    try {
      setSending(true);
      setShowConfirm(false);
      setFeedback("");

      if (singleContactMode) {
        await sendAdminSMSToContact(
          selectedContact.contactId,
          cleanMessage
        );

        setFeedback(
          `SMS sent successfully to ${selectedContact.contactName}.`
        );
      } else {
        const result =
          await sendAdminSMSBroadcast(
            cleanMessage
          );

        setFeedback(
          `SMS sent successfully to ${result.recipients} customer${
            result.recipients === 1 ? "" : "s"
          }.`
        );
      }

      setMessage("");
    } catch (error) {
      setFeedback(
        error.message ||
          "Unable to send SMS."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-sms-page">
      <div className="admin-sms-header">
        <span>MARKETING</span>

        <h1>SMS Broadcast</h1>

        <p>
          {singleContactMode
            ? "Send an SMS directly to the selected customer."
            : "Send an SMS message to your Greatness Mall customers."}
        </p>
      </div>

      <div className="admin-sms-count">
        {singleContactMode ? (
          <User size={20} />
        ) : (
          <Users size={20} />
        )}

        <div>
          <span>
            {singleContactMode
              ? "Selected Customer"
              : "Available Customers"}
          </span>

          <strong>
            {singleContactMode
              ? selectedContact.contactName
              : loading
                ? "..."
                : customerCount}
          </strong>

          {singleContactMode && (
            <small>
              {selectedContact.contactPhone}
            </small>
          )}
        </div>
      </div>

      {singleContactMode && (
        <button
          type="button"
          className="admin-sms-clear-recipient"
          onClick={clearSelectedContact}
        >
          Send to All Customers Instead
        </button>
      )}

      <form
        className="admin-sms-card"
        onSubmit={handleSubmit}
      >
        <div className="admin-sms-card-heading">
          <MessageSquareText size={20} />

          <div>
            <h2>Message</h2>

            <p>
              {singleContactMode
                ? `This message will be sent only to ${selectedContact.contactName}.`
                : "This message will be sent to all customers with a phone number."}
            </p>
          </div>
        </div>

        <textarea
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          maxLength={600}
          rows={7}
          placeholder="Write your SMS message..."
          required
        />

        <div className="admin-sms-bottom">
          <span>
            {message.length}/600 characters
          </span>

          <button
            type="submit"
            disabled={
              sending ||
              loading ||
              (
                !singleContactMode &&
                customerCount === 0
              )
            }
          >
            <Send size={17} />

            {sending
              ? "Sending..."
              : singleContactMode
                ? `Send SMS to ${selectedContact.contactName}`
                : "Send SMS to All Customers"}
          </button>
        </div>

        {feedback && (
          <p className="admin-sms-feedback">
            {feedback}
          </p>
        )}
      </form>

      {showConfirm && (
        <div
          className="admin-sms-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowConfirm(false);
            }
          }}
        >
          <div
            className="admin-sms-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sms-confirm-title"
          >
            <button
              type="button"
              className="admin-sms-modal-close"
              onClick={() =>
                setShowConfirm(false)
              }
              aria-label="Close confirmation"
            >
              <X size={18} />
            </button>

            <div className="admin-sms-confirm-icon">
              <Send size={22} />
            </div>

            <span className="admin-sms-confirm-label">
              CONFIRM MESSAGE
            </span>

            <h2 id="sms-confirm-title">
              Send SMS?
            </h2>

            <p>
              {singleContactMode
                ? `This message will be sent to ${selectedContact.contactName}.`
                : `This message will be sent to ${customerCount} customer${
                    customerCount === 1 ? "" : "s"
                  }.`}
            </p>

            <div className="admin-sms-confirm-recipient">
              <span>Recipient</span>

              <strong>
                {singleContactMode
                  ? selectedContact.contactName
                  : `All Customers (${customerCount})`}
              </strong>

              {singleContactMode && (
                <small>
                  {selectedContact.contactPhone}
                </small>
              )}
            </div>

            <div className="admin-sms-confirm-preview">
              <span>Message</span>

              <p>{message}</p>
            </div>

            <div className="admin-sms-confirm-actions">
              <button
                type="button"
                className="admin-sms-confirm-cancel"
                onClick={() =>
                  setShowConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-sms-confirm-send"
                onClick={confirmSend}
                disabled={sending}
              >
                <Send size={16} />

                {sending
                  ? "Sending..."
                  : "Send SMS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSms;