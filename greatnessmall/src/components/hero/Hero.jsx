import React from "react";
import { NavLink } from "react-router-dom";
import "./Hero.css";
import heroImage from "../../assets/hero.png";

const Hero = () => {
  return (
    <section className="hero-section">

      {/* BACKGROUND IMAGE */}
      <div
        className="hero-background"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
        aria-hidden="true"
      />

      {/* DARK GRADIENT */}
      <div
        className="hero-overlay"
        aria-hidden="true"
      />

      {/* DECORATIVE GLOWS */}
      <div
        className="hero-glow hero-glow-orange"
        aria-hidden="true"
      />

      <div
        className="hero-glow hero-glow-purple"
        aria-hidden="true"
      />

      <div className="hero-container">
        <div className="hero-content">

          <span className="hero-eyebrow">
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
              Explore our Products in English
            </NavLink>

            <NavLink
              to="/twi"
              className="hero-secondary-button"
            >
              Explore our Products in Twi
            </NavLink>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;