import React from "react";
import { NavLink } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const whatsappNumber = "233578622158";

  const whatsappMessage =
    "Hello Greatness Mall, I visited your website and I would like to know more about your products.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand-column">

          <NavLink
            to="/home"
            className="footer-brand"
          >
            <div
              className="footer-logo"
              aria-hidden="true"
            >
              G
            </div>

            <div>
              <h2>Greatness Mall</h2>
              <span>Quality. Value. Convenience.</span>
            </div>
          </NavLink>

          <p className="footer-brand-description">
            Explore quality wellness products and useful information
            designed to support everyday living.
          </p>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-column">

          <h3>Quick Links</h3>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            <NavLink to="/home">
              Home
            </NavLink>

            <NavLink to="/products">
              Products
            </NavLink>

            <NavLink to="/faq">
              FAQ
            </NavLink>

            <NavLink to="/twi">
              Twi
            </NavLink>
          </nav>

        </div>


        {/* CONTACT */}
        <div className="footer-column">

          <h3>Contact</h3>

          <div className="footer-contact-list">

            <a
              href="tel:+233578622158"
              className="footer-contact-item"
            >
              <Phone
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                +233 57 862 2158
              </span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
            >
              <MessageCircle
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                WhatsApp
              </span>
            </a>

            <a
              href="mailto:info@greatnessmall.com"
              className="footer-contact-item"
            >
              <Mail
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                info@greatnessmall.com
              </span>
            </a>

          </div>

        </div>

      </div>


      {/* BOTTOM BAR */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {currentYear} Greatness Mall. All rights reserved.
          </p>

          <p className="footer-credit">
            Designed by{" "}
            <span>
              BenKreations
            </span>
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;