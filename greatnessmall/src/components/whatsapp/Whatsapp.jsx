import React, { useState } from "react";
import {
  MessageCircle,
  X,
} from "lucide-react";

import "./Whatsapp.css";

const Whatsapp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "233578622158";

  const consultants = [
    {
      id: 1,
      name: "Consultant 1",
      number: "+233 57 862 2158",
    },
    {
      id: 2,
      name: "Consultant 2",
      number: "+233 57 862 2158",
    },
    {
      id: 3,
      name: "Consultant 3",
      number: "+233 57 862 2158",
    },
  ];

  /* =========================================================
     WHATSAPP LINK

     The message is fixed and safely encoded.
     Later Django can provide consultant details dynamically.
  ========================================================= */

  const getWhatsappLink = (consultantName) => {
    const message =
      `Hello Greatness Mall, I would like to speak with ${consultantName} about your products.`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
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
                href={getWhatsappLink(consultant.name)}
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