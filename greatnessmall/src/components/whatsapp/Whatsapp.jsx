import React, { useState } from "react";
import {
  MessageCircle,
  X,
} from "lucide-react";

import "./Whatsapp.css";

const Whatsapp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const consultants = [
    {
      id: 1,
      name: "Consultant 1",
      number: "+233 53 757 7738",
      whatsappNumber: "233537577738",
    },
    {
      id: 2,
      name: "Consultant 2",
      number: "+233 57 862 2158",
      whatsappNumber: "233578622158",
    },
  ];

  /* =========================================================
     WHATSAPP LINK
  ========================================================= */

  const getWhatsappLink = (consultant) => {
    const message =
      `Hello Greatness Mall, I would like to speak with ${consultant.name} about your products.`;

    return `https://wa.me/${consultant.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="whatsapp-widget">

      {/* =====================================================
          CONSULTANT PANEL
      ====================================================== */}

      <div
        className={
          isOpen
            ? "whatsapp-panel whatsapp-panel-open"
            : "whatsapp-panel"
        }
        aria-hidden={!isOpen}
      >

        {/* HEADER */}

        <div className="whatsapp-panel-header">

          <div className="whatsapp-header-icon">
            <MessageCircle
              size={28}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div>
            <h3>
              Need Help? Chat with us
            </h3>

            <p>
              Choose a consultant below to chat on WhatsApp.
            </p>
          </div>

        </div>

        {/* BODY */}

        <div className="whatsapp-panel-body">

          <p className="whatsapp-response-text">
            We typically reply within a few minutes.
          </p>

          <div className="whatsapp-consultants">

            {consultants.map((consultant) => (

              <a
                key={consultant.id}
                href={getWhatsappLink(consultant)}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-consultant"
                aria-label={`Chat with ${consultant.name} on WhatsApp`}
              >

                {/* CONSULTANT AVATAR */}

                <div className="consultant-avatar">
                  G
                </div>

                {/* CONSULTANT INFO */}

                <div className="consultant-info">

                  <strong>
                    {consultant.name}
                  </strong>

                  <span>
                    {consultant.number}
                  </span>

                </div>

                {/* WHATSAPP ICON */}

                <div className="consultant-whatsapp-icon">

                  <MessageCircle
                    size={21}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                </div>

              </a>

            ))}

          </div>

        </div>

      </div>

      {/* =====================================================
          FLOATING TRIGGER
      ====================================================== */}

      <div className="whatsapp-trigger-area">

        {!isOpen && (
          <span className="whatsapp-help-label">
            Need Help?
          </span>
        )}

        <button
          type="button"
          className={
            isOpen
              ? "whatsapp-trigger whatsapp-trigger-open"
              : "whatsapp-trigger"
          }
          onClick={() =>
            setIsOpen((current) => !current)
          }
          aria-label={
            isOpen
              ? "Close WhatsApp support"
              : "Open WhatsApp support"
          }
          aria-expanded={isOpen}
        >

          {isOpen ? (
            <X
              size={27}
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : (
            <MessageCircle
              size={28}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}

        </button>

      </div>

    </div>
  );
};

export default Whatsapp;