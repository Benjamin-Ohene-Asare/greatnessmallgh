import React from "react";
import welcomeImage from "../../assets/WELCOME.png";
import "./WelcomeSection.css";

const WelcomeSection = () => {
  const contacts = [
    {
      id: 1,
      number: "+233 53 757 7738",
      whatsappNumber: "233537577738",
    },
    {
      id: 2,
      number: "+233 57 862 2158",
      whatsappNumber: "233578622158",
    },
  ];

  const whatsappMessage =
    "Hello Greatness Mall, I visited your website and I would like to know more about your products.";

  const getWhatsappUrl = (phoneNumber) =>
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

  return (
    <section className="welcome-section">
      <div className="welcome-container">

        {/* LEFT IMAGE */}
        <div className="welcome-image-wrapper">
          <img
            src={welcomeImage}
            alt="Customer holding a Greatness Mall wellness product"
            className="welcome-image"
            loading="lazy"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="welcome-content">

          <span className="welcome-label">
            WELCOME
          </span>

          <h2>
            We’re Excited to Have You Here.
          </h2>

          <p className="welcome-description">
            Explore our products and reach out anytime for assistance.
          </p>

          {/* CONTACT BUTTONS */}
          <div className="welcome-contact-buttons">

            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={getWhatsappUrl(
                  contact.whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="welcome-whatsapp-button"
                aria-label={`Contact Greatness Mall on WhatsApp at ${contact.number}`}
              >
                <span className="welcome-button-title">
                  Contact Us Now
                </span>

                <span className="welcome-button-number">
                  {contact.number}
                </span>
              </a>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default WelcomeSection;