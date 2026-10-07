import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import {
  getProductBySlug,
} from "../../services/backend";

import "./ProductDetails.css";


/* =========================================================
   SAFE YOUTUBE EMBED HELPER

   Supports:
   - youtube.com/watch?v=
   - youtu.be/
   - youtube.com/embed/
   - youtube.com/shorts/

   Autoplay starts muted because most browsers block
   automatic playback with sound.
========================================================= */

const getYouTubeEmbedUrl = (
  youtubeUrl
) => {
  if (!youtubeUrl) {
    return "";
  }

  try {
    const url = new URL(
      youtubeUrl
    );

    const hostname =
      url.hostname
        .replace(/^www\./, "")
        .toLowerCase();

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId =
        url.pathname
          .split("/")
          .filter(Boolean)[0] ||
        "";
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      if (
        url.pathname === "/watch"
      ) {
        videoId =
          url.searchParams.get(
            "v"
          ) || "";
      }

      if (
        url.pathname.startsWith(
          "/embed/"
        )
      ) {
        videoId =
          url.pathname
            .split("/")
            .filter(Boolean)[1] ||
          "";
      }

      if (
        url.pathname.startsWith(
          "/shorts/"
        )
      ) {
        videoId =
          url.pathname
            .split("/")
            .filter(Boolean)[1] ||
          "";
      }
    }

    if (!videoId) {
      return "";
    }

    /*
      Only allow normal YouTube video ID characters.
    */
    if (
      !/^[a-zA-Z0-9_-]{6,20}$/.test(
        videoId
      )
    ) {
      return "";
    }

    return (
      `https://www.youtube-nocookie.com/embed/${videoId}` +
      "?autoplay=1" +
      "&mute=1" +
      "&playsinline=1" +
      "&rel=0"
    );
  } catch {
    return "";
  }
};


const ProductDetails = () => {
  const { slug } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================================
     LOAD PRODUCT FROM DJANGO
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProductBySlug(
            slug
          );

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        console.error(
          "Failed to load product:",
          err
        );

        if (!cancelled) {
          setError(
            "Product could not be found."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);


  /* =========================================================
     YOUTUBE URL
  ========================================================= */

  const youtubeEmbedUrl =
    useMemo(
      () =>
        getYouTubeEmbedUrl(
          product?.youtube_url
        ),
      [product?.youtube_url]
    );


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="product-not-found">

        <h1>
          Loading Product
        </h1>

        <p>
          Please wait while the product information loads.
        </p>

      </section>
    );
  }


  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (
    error ||
    !product
  ) {
    return (
      <section className="product-not-found">

        <h1>
          Product Not Found
        </h1>

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

  const whatsappNumber =
    "233578622158";

  const whatsappMessage =
    `Hello Greatness Mall, I am interested in ${product.name}. ` +
    `I saw this product on your website and would like more information about it.`;

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(
      whatsappMessage
    )}`;


  return (
    <main className="product-details-page">

      <div className="product-details-container">

        {/* =====================================================
            BACK TO PRODUCTS
        ====================================================== */}

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

            DESKTOP:
            YOUTUBE | PRODUCT IMAGE

            MOBILE:
            YOUTUBE
            PRODUCT IMAGE
        ====================================================== */}

        {(youtubeEmbedUrl ||
          product.main_image) && (

          <section className="product-top-media">

            {/* YOUTUBE */}

            {youtubeEmbedUrl && (

              <div className="product-video-box">

                <iframe
                  src={youtubeEmbedUrl}
                  title={`${product.name} video`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                />

              </div>

            )}


            {/* MAIN PRODUCT IMAGE */}

            {product.main_image && (

              <div className="product-top-image-box">

                <img
                  src={product.main_image}
                  alt={product.name}
                  loading="eager"
                />

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            PRODUCT INTRO
        ====================================================== */}

        <section className="product-intro">

          {product.category?.name && (

            <span className="product-intro-category">
              {product.category.name}
            </span>

          )}


          <h1>
            {product.name}
          </h1>


          {product.tagline && (

            <h2>
              {product.tagline}
            </h2>

          )}


          {product.description && (

            <p>
              {product.description}
            </p>

          )}

        </section>


        {/* =====================================================
            PRODUCT BENEFITS

            Main product image has been removed from this
            section because it now sits beside the video.
        ====================================================== */}

        <section className="product-benefits-layout">

          <div className="product-benefits-content">

            <span className="product-section-label">
              PRODUCT BENEFITS
            </span>


            <h2>
              {product.name} Major Benefits
            </h2>


            {product.benefits?.length >
            0 ? (

              <ul className="product-benefits-list">

                {product.benefits.map(
                  (benefit) => (

                    <li
                      key={
                        benefit.id
                      }
                    >
                      {
                        benefit.text
                      }
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
            ORDER NOW
        ====================================================== */}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="product-order-strip"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <MessageCircle
            size={19}
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

        {product.ingredients?.length >
          0 && (

          <section className="product-ingredients">

            <span className="product-section-label">
              WHAT'S INSIDE
            </span>


            <h2>
              Main Ingredients
            </h2>


            <div className="product-ingredients-grid">

              {product.ingredients.map(
                (ingredient) => (

                  <div
                    key={
                      ingredient.id
                    }
                    className="product-ingredient-item"
                  >

                    <span
                      aria-hidden="true"
                    ></span>

                    <p>
                      {
                        ingredient.name
                      }
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* =====================================================
            ADDITIONAL INFORMATION
        ====================================================== */}

        {product.extra_information && (

          <section className="product-extra-info">

            <h3>
              Additional Information
            </h3>

            <p>
              {
                product.extra_information
              }
            </p>

          </section>

        )}

      </div>

    </main>
  );
};

export default ProductDetails;