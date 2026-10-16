import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  LoaderCircle,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";

import {
  getProductBySlug,
} from "../../services/backend";

import {
  useCart,
} from "../../context/CartContext";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";

import "./ProductDetails.css";


/* =========================================================
   SAFE YOUTUBE EMBED HELPER
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

  const navigate = useNavigate();

  const {
    customer,
    loading: authLoading,
  } = useCustomerAuth();

  const {
    addItem,
  } = useCart();


  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================================
     CART STATE
  ========================================================= */

  const [
    addingToCart,
    setAddingToCart,
  ] = useState(false);

  const [
    cartNotice,
    setCartNotice,
  ] = useState(null);


  /* =========================================================
     WHATSAPP ORDER STATE
  ========================================================= */

  const [
    orderModalOpen,
    setOrderModalOpen,
  ] = useState(false);

  const [
    orderQuantity,
    setOrderQuantity,
  ] = useState("1");


  /* =========================================================
     LOAD PRODUCT FROM DJANGO
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadProduct =
      async () => {
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
     CART NOTICE TIMER
  ========================================================= */

  useEffect(() => {
    if (!cartNotice) {
      return undefined;
    }

    const timer =
      window.setTimeout(() => {
        setCartNotice(null);
      }, 3000);

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [cartNotice]);


  /* =========================================================
     ORDER MODAL
  ========================================================= */

  useEffect(() => {
    if (!orderModalOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setOrderModalOpen(false);
        setOrderQuantity("1");
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [orderModalOpen]);


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
     PRODUCT SHARE URL
  ========================================================= */

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL
      ?.replace(/\/$/, "") ||
    "";

  const whatsappNumber =
    "233578622158";

  const productShareUrl =
    `${backendUrl}/products/share/${product.slug}/`;


  /* =========================================================
     SHARE PRODUCT
  ========================================================= */

  const handleShare = async () => {
    const shareData = {
      title: product.name,

      text:
        product.short_description ||
        product.description ||
        `Discover ${product.name} at Greatness Mall.`,

      url: productShareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );

        return;
      }

      await navigator.clipboard.writeText(
        productShareUrl
      );

      window.alert(
        "Product link copied."
      );
    } catch (err) {
      if (
        err?.name !== "AbortError"
      ) {
        console.error(
          "Product sharing failed:",
          err
        );
      }
    }
  };


  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart =
    async () => {
      if (authLoading) {
        return;
      }

      if (!customer) {
        navigate(
          "/account/auth"
        );

        return;
      }

      setAddingToCart(true);
      setCartNotice(null);

      try {
        await addItem(
          product.id,
          1
        );

        setCartNotice({
          type: "success",
          message:
            `${product.name} was added to your cart.`,
        });
      } catch (err) {
        console.error(
          "Could not add product to cart:",
          err
        );

        setCartNotice({
          type: "error",
          message:
            err?.message ||
            "Could not add this product to your cart.",
        });
      } finally {
        setAddingToCart(false);
      }
    };


  /* =========================================================
     WHATSAPP QUANTITY
  ========================================================= */

  const parsedQuantity =
    Math.max(
      1,
      Number.parseInt(
        orderQuantity,
        10
      ) || 1
    );


  const openOrderModal = () => {
    setOrderQuantity("1");
    setOrderModalOpen(true);
  };


  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setOrderQuantity("1");
  };


  const decreaseQuantity = () => {
    setOrderQuantity(
      String(
        Math.max(
          1,
          parsedQuantity - 1
        )
      )
    );
  };


  const increaseQuantity = () => {
    setOrderQuantity(
      String(
        parsedQuantity + 1
      )
    );
  };


  const handleQuantityChange = (
    event
  ) => {
    const value =
      event.target.value.replace(
        /\D/g,
        ""
      );

    setOrderQuantity(value);
  };


  const handleQuantityBlur = () => {
    if (!orderQuantity) {
      setOrderQuantity("1");
      return;
    }

    setOrderQuantity(
      String(parsedQuantity)
    );
  };


  const continueToWhatsApp =
    () => {
      const message =
        `Hello Greatness Mall,\n\n` +
        `I would like to order this product.\n\n` +
        `Product: ${product.name}\n` +
        `Quantity: ${parsedQuantity}\n\n` +
        `Product link:\n${productShareUrl}`;

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}` +
        `?text=${encodeURIComponent(
          message
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      closeOrderModal();
    };


  return (
    <>
      <main className="product-details-page">

        <div className="product-details-container">

          {/* BACK TO PRODUCTS */}

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


          {/* CART NOTICE */}

          {cartNotice && (
            <div
              className={`product-detail-cart-notice ${
                cartNotice.type ===
                "error"
                  ? "product-detail-cart-notice-error"
                  : ""
              }`}
              role={
                cartNotice.type ===
                "error"
                  ? "alert"
                  : "status"
              }
            >
              {cartNotice.message}
            </div>
          )}


          {/* TOP MEDIA */}

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
                    src={
                      product.main_image
                    }
                    alt={
                      product.name
                    }
                    loading="eager"
                  />


                  <button
                    type="button"
                    className="product-detail-cart-button"
                    aria-label={
                      customer
                        ? `Add ${product.name} to cart`
                        : `Sign in to add ${product.name} to cart`
                    }
                    title={
                      customer
                        ? "Add to Cart"
                        : "Sign in to Add to Cart"
                    }
                    disabled={
                      authLoading ||
                      addingToCart
                    }
                    onClick={
                      handleAddToCart
                    }
                  >
                    {addingToCart ? (
                      <LoaderCircle
                        size={20}
                        strokeWidth={2}
                        className="product-detail-cart-loader"
                        aria-hidden="true"
                      />
                    ) : (
                      <ShoppingCart
                        size={20}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                </div>
              )}

            </section>
          )}


          {/* PRODUCT INTRO */}

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


          {/* PRODUCT BENEFITS */}

          {product.benefits.length >
            0 && (

            <section className="product-benefits-layout">

              <div className="product-benefits-content">

                <span className="product-section-label">
                  PRODUCT BENEFITS
                </span>

                <h2>
                  {product.name} Major Benefits
                </h2>

                <ul className="product-benefits-list">

                  {product.benefits.map(
                    (benefit) => (
                      <li
                        key={
                          benefit.id ??
                          benefit.text
                        }
                      >
                        {benefit.text}
                      </li>
                    )
                  )}

                </ul>

              </div>

            </section>
          )}


          {/* PRODUCT ACTIONS */}

          <div className="product-detail-actions">

            <button
              type="button"
              className="product-share-strip"
              onClick={
                handleShare
              }
            >
              Share Product
            </button>


            <button
              type="button"
              className="product-order-strip"
              aria-label={`Order ${product.name} on WhatsApp`}
              onClick={
                openOrderModal
              }
            >
              <MessageCircle
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                Order Now
              </span>
            </button>

          </div>


          {/* INGREDIENTS */}

          {product.ingredients.length >
            0 && (

            <section className="product-ingredients">

              <span className="product-section-label">
                WHAT&apos;S INSIDE
              </span>

              <h2>
                Main Ingredients
              </h2>

              <div className="product-ingredients-grid">

                {product.ingredients.map(
                  (ingredient) => (
                    <div
                      key={
                        ingredient.id ??
                        ingredient.name
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


          {/* ADDITIONAL INFORMATION */}

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


      {/* =====================================================
          WHATSAPP QUANTITY POPUP
      ====================================================== */}

      {orderModalOpen && (
        <div
          className="product-detail-order-overlay"
          role="presentation"
          onMouseDown={
            closeOrderModal
          }
        >
          <div
            className="product-detail-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-order-title"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="product-detail-order-close"
              aria-label="Close quantity selection"
              onClick={
                closeOrderModal
              }
            >
              <X
                size={19}
                strokeWidth={2}
              />
            </button>


            <span className="product-detail-order-label">
              ORDER ON WHATSAPP
            </span>


            <h3
              id="product-detail-order-title"
            >
              {product.name}
            </h3>


            <p>
              Select the quantity you
              would like before
              continuing to WhatsApp.
            </p>


            <div className="product-detail-order-quantity">

              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={
                  parsedQuantity <= 1
                }
                onClick={
                  decreaseQuantity
                }
              >
                <Minus
                  size={18}
                  strokeWidth={2}
                />
              </button>


              <input
                type="text"
                inputMode="numeric"
                aria-label="Order quantity"
                value={
                  orderQuantity
                }
                onChange={
                  handleQuantityChange
                }
                onBlur={
                  handleQuantityBlur
                }
              />


              <button
                type="button"
                aria-label="Increase quantity"
                onClick={
                  increaseQuantity
                }
              >
                <Plus
                  size={18}
                  strokeWidth={2}
                />
              </button>

            </div>


            <button
              type="button"
              className="product-detail-order-whatsapp"
              onClick={
                continueToWhatsApp
              }
            >
              <MessageCircle
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              Continue on WhatsApp
            </button>

          </div>
        </div>
      )}

    </>
  );
};


export default ProductDetails;