import React from "react";
import heroImage from "../../assets/hero.png";
import "./ProductHero.css";

const ProductHero = () => {
  return (
    <section
      className="product-page-hero"
      style={{
        backgroundImage: `linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.84) 0%,
          rgba(0, 0, 0, 0.70) 40%,
          rgba(0, 0, 0, 0.34) 70%,
          rgba(0, 0, 0, 0.16) 100%
        ), url(${heroImage})`,
      }}
    >
      <div className="product-page-hero-container">

        <div className="product-page-hero-content">

          <span className="product-page-hero-label">
            GREATNESS MALL
          </span>

          <h1>
            Explore Our Products
          </h1>

          <p>
            Browse our wellness range and find the product that fits your needs.
          </p>

        </div>

      </div>
    </section>
  );
};

export default ProductHero;