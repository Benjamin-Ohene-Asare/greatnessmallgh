import React from "react";
import welcomeImage from "../../assets/WELCOME.png";
import "./WelcomeSection.css";

const WelcomeSection = () => {
  const phoneNumber = "233578622158";

  const whatsappMessage =
    "Hello Greatness Mall, I visited your website and I would like to know more about your products.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
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

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="welcome-whatsapp-button"
            aria-label="Contact Greatness Mall on WhatsApp"
          >
            Contact Us Now
          </a>

          {/* <p className="welcome-phone">
            +233 57 862 2158
          </p> */}

        </div>

      </div>
    </section>
  );
};

export default WelcomeSection;