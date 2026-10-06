import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  categories,
  products,
} from "../../pages/data/product";

import "./ProductCatalog.css";

const ProductCatalog = ({ showHeader = true }) => {
  const [activeCategory, setActiveCategory] =
    useState("All");

  /* =========================================================
     PRODUCT FILTERING
  ========================================================= */

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === activeCategory
        );


  /* =========================================================
     WHATSAPP ORDER LINK

     For now:
     - sends the selected product name
     - sends a pre-filled enquiry

     Later:
     Django will provide a public product URL that can be
     included in the WhatsApp message for image/link previews.
  ========================================================= */

  const whatsappNumber = "233578622158";

  const getWhatsAppUrl = (product) => {
    const message =
      `Hello Greatness Mall, I am interested in ${product.name}. ` +
      `I saw this product on your website and would like to know more about it.`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  };


  return (
    <section className="product-catalog">

      <div className="product-catalog-container">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        {showHeader && (
          <div className="product-catalog-header">

            <span className="product-catalog-eyebrow">
              GREATNESS MALL
            </span>

            <h2>
              Our Products
            </h2>

            <p>
              Explore our range of wellness products.
            </p>

          </div>
        )}


        {/* =====================================================
            STICKY CATEGORY FILTERS

            Frontend filtering only for now.
            Django will provide categories dynamically later.
        ====================================================== */}

        <div className="product-category-sticky">

          <div
            className="product-category-filters"
            aria-label="Product categories"
          >

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}

          </div>

        </div>


        {/* =====================================================
            PRODUCT GRID
        ====================================================== */}

        <div className="product-grid">

          {filteredProducts.map((product) => (

            <article
              key={product.id}
              className="product-card"
            >

              {/* PRODUCT IMAGE */}

              <div className="product-image-area">

                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />

              </div>


              {/* PRODUCT DETAILS */}

              <div className="product-card-content">

                <span className="product-category-name">
                  {product.category}
                </span>

                <h3>
                  {product.name}
                </h3>

                <p>
                  {product.shortDescription}
                </p>


                {/* =================================================
                    PRODUCT ACTIONS

                    Learn More:
                    Opens the unique product details page.

                    Order Now:
                    Opens WhatsApp with the exact product name.
                ================================================= */}

                <div className="product-card-actions">

                  <NavLink
                    to={`/products/${product.slug}`}
                    className="product-learn-button"
                  >
                    Learn More
                  </NavLink>


                  <a
                    href={getWhatsAppUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-order-button"
                    aria-label={`Order ${product.name} on WhatsApp`}
                  >
                    Order Now
                  </a>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ProductCatalog;