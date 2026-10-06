import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import { products } from "../data/product";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { slug } = useParams();

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <section className="product-not-found">
        <h1>Product Not Found</h1>

        <p>
          The product you are looking for is not available.
        </p>

        <NavLink
          to="/products"
          className="product-not-found-link"
        >
          Back to Products
        </NavLink>
      </section>
    );
  }

  /* =========================================================
     WHATSAPP ORDER
  ========================================================= */

  const whatsappNumber = "233578622158";

  const whatsappMessage =
    `Hello Greatness Mall, I am interested in ${product.name}. ` +
    `I saw this product on your website and would like more information about it.`;

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

  return (
    <main className="product-details-page">

      <div className="product-details-container">

        {/* BACK */}

        <NavLink
          to="/products"
          className="product-details-back"
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          Back to Products
        </NavLink>


        {/* =====================================================
            TOP MEDIA
        ====================================================== */}

        {(product.video || product.promoImage) && (
          <section className="product-top-media">

            {product.video && (
              <div className="product-video-box">
                <video
                  controls
                  preload="metadata"
                  poster={product.videoPoster || ""}
                >
                  <source
                    src={product.video}
                    type="video/mp4"
                  />

                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {product.promoImage && (
              <div className="product-promo-box">
                <img
                  src={product.promoImage}
                  alt={`${product.name} promotional information`}
                  loading="lazy"
                />
              </div>
            )}

          </section>
        )}


        {/* =====================================================
            PRODUCT INTRO
        ====================================================== */}

        <section className="product-intro">

          <span className="product-intro-category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>

          {product.tagline && (
            <h2>
              {product.tagline}
            </h2>
          )}

          <p>
            {product.description}
          </p>

        </section>


        {/* =====================================================
            PRODUCT BENEFITS
        ====================================================== */}

        <section className="product-benefits-layout">

          <div className="product-benefits-image">

            <img
              src={product.image}
              alt={product.name}
            />

          </div>


          <div className="product-benefits-content">

            <span className="product-section-label">
              PRODUCT BENEFITS
            </span>

            <h2>
              {product.name} Major Benefits
            </h2>

            {product.benefits?.length > 0 ? (
              <ul className="product-benefits-list">

                {product.benefits.map(
                  (benefit, index) => (
                    <li
                      key={`${product.id}-benefit-${index}`}
                    >
                      {benefit}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="product-empty-text">
                More information about this product will be available soon.
              </p>
            )}

          </div>

        </section>


        {/* =====================================================
            ORDER STRIP
        ====================================================== */}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="product-order-strip"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <MessageCircle
            size={20}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>
            Order Now
          </span>
        </a>


        {/* =====================================================
            INGREDIENTS
        ====================================================== */}

        {product.ingredients?.length > 0 && (
          <section className="product-ingredients">

            <span className="product-section-label">
              WHAT'S INSIDE
            </span>

            <h2>
              Main Ingredients
            </h2>

            <div className="product-ingredients-grid">

              {product.ingredients.map(
                (ingredient, index) => (
                  <div
                    key={`${product.id}-ingredient-${index}`}
                    className="product-ingredient-item"
                  >
                    <span></span>

                    <p>
                      {ingredient}
                    </p>
                  </div>
                )
              )}

            </div>

          </section>
        )}


        {/* =====================================================
            EXTRA INFORMATION
        ====================================================== */}

        {product.extraInfo && (
          <section className="product-extra-info">

            <h3>
              Additional Information
            </h3>

            <p>
              {product.extraInfo}
            </p>

          </section>
        )}

      </div>

    </main>
  );
};

export default ProductDetails;