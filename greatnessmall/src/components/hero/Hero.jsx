import React from "react";
import { NavLink } from "react-router-dom";
import "./Hero.css";
import heroImage from "../../assets/hero.png";

const Hero = () => {
  return (
    <section
      className="hero-section"
style={{
  backgroundImage: `linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.82) 0%,
    rgba(0, 0, 0, 0.72) 32%,
    rgba(0, 0, 0, 0.48) 58%,
    rgba(0, 0, 0, 0.22) 100%
  ), url(${heroImage})`,
}}
    >
      <div className="hero-container">

        {/* ==============================================
            HERO CONTENT
            Static trusted content only.
            No user-generated HTML is rendered here.
        =============================================== */}
        <div className="hero-content">

          <span className="hero-label">
            GREATNESS MALL
          </span>

          <h1 className="hero-title">
  Wellness Products
  <br />
  For Better Living
</h1>

<p className="hero-description">
  Discover quality wellness products designed to support
  everyday health and wellbeing.
</p>

          <div className="hero-actions">
            <NavLink
              to="/products"
              className="hero-primary-button"
            >
              Explore Products
            </NavLink>

            <NavLink
              to="/twi"
              className="hero-secondary-button"
            >
              Learn in Twi
            </NavLink>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;