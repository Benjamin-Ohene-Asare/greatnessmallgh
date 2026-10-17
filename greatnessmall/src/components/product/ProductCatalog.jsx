import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LoaderCircle,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";

import {
  getProductCategories,
  getProducts,
} from "../../services/backend";

import {
  useCart,
} from "../../context/CartContext";

import {
  useCustomerAuth,
} from "../../context/CustomerAuthContext";

import "./ProductCatalog.css";


const ProductCatalog = ({
  showHeader = true,
}) => {
  const navigate = useNavigate();

  const {
    customer,
    loading: authLoading,
  } = useCustomerAuth();

  const {
    addItem,
  } = useCart();


  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================
     ADD TO CART STATE
  ========================= */

  const [
    addingProductId,
    setAddingProductId,
  ] = useState(null);

  const [
    cartNotice,
    setCartNotice,
  ] = useState(null);


  /* =========================
     WHATSAPP QUANTITY STATE
  ========================= */

  const [
    orderProduct,
    setOrderProduct,
  ] = useState(null);

  const [
    orderQuantity,
    setOrderQuantity,
  ] = useState("1");


  /* =========================
     LOAD PRODUCTS
  ========================= */

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productsData,
          categoriesData,
        ] = await Promise.all([
          getProducts(),
          getProductCategories(),
        ]);

        if (cancelled) {
          return;
        }

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load product catalog:",
          err
        );

        if (!cancelled) {
          setError(
            "Products could not be loaded at the moment."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);


  /* =========================
     CART NOTICE
  ========================= */

  useEffect(() => {
    if (!cartNotice) {
      return undefined;
    }

    const timer =
      window.setTimeout(() => {
        setCartNotice(null);
      }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [cartNotice]);


  /* =========================
     QUANTITY MODAL
  ========================= */

  useEffect(() => {
    if (!orderProduct) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleEscape = (
      event
    ) => {
      if (event.key === "Escape") {
        setOrderProduct(null);
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
  }, [orderProduct]);


  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    useMemo(() => {
      if (
        activeCategory === "all"
      ) {
        return products;
      }

      return products.filter(
        (product) => {
          const matchesNewCategories =
            product.categories?.some(
              (category) =>
                category.slug ===
                activeCategory
            );

          const matchesOldCategory =
            product.category?.slug ===
            activeCategory;

          return (
            matchesNewCategories ||
            matchesOldCategory
          );
        }
      );
    }, [
      products,
      activeCategory,
    ]);


  /* =========================
     PRODUCT LINKS
  ========================= */

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL
      ?.replace(/\/$/, "") || "";

  const whatsappNumber =
    "233537577738";


  const getProductShareUrl = (
    product
  ) => {
    return (
      `${backendUrl}/products/share/` +
      `${product.slug}/`
    );
  };


  const getWhatsAppUrl = (
    product,
    quantity
  ) => {
    const productUrl =
      getProductShareUrl(product);

    const message =
      `Hello Greatness Mall,\n\n` +
      `I would like to order this product.\n\n` +
      `Product: ${product.name}\n` +
      `Quantity: ${quantity}\n\n` +
      `Product link:\n${productUrl}`;

    return (
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(
        message
      )}`
    );
  };


  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = async (
    product
  ) => {
    if (authLoading) {
      return;
    }

    if (!customer) {
      navigate(
        "/account/auth"
      );

      return;
    }

    setAddingProductId(
      product.id
    );

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
      setAddingProductId(null);
    }
  };


  /* =========================
     OPEN WHATSAPP QUANTITY
  ========================= */

  const handleOrderNow = (
    product
  ) => {
    setOrderProduct(product);
    setOrderQuantity("1");
  };


  const closeOrderModal = () => {
    setOrderProduct(null);
    setOrderQuantity("1");
  };


  const parsedQuantity =
    Math.max(
      1,
      Number.parseInt(
        orderQuantity,
        10
      ) || 1
    );


  const decreaseOrderQuantity =
    () => {
      setOrderQuantity(
        String(
          Math.max(
            1,
            parsedQuantity - 1
          )
        )
      );
    };


  const increaseOrderQuantity =
    () => {
      setOrderQuantity(
        String(
          parsedQuantity + 1
        )
      );
    };


  const handleQuantityInput = (
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


  const continueToWhatsApp = () => {
    if (!orderProduct) {
      return;
    }

    const whatsappUrl =
      getWhatsAppUrl(
        orderProduct,
        parsedQuantity
      );

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    closeOrderModal();
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="product-catalog">
        <div className="product-catalog-container">
          <div className="product-catalog-status">
            Loading products...
          </div>
        </div>
      </section>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <section className="product-catalog">
        <div className="product-catalog-container">
          <div className="product-catalog-status product-catalog-error">
            {error}
          </div>
        </div>
      </section>
    );
  }


  return (
    <>
      <section className="product-catalog">
        <div className="product-catalog-container">

          {showHeader && (
            <div className="product-catalog-header">
              <h2>
                Our Products
              </h2>

              <p>
                Explore our range of wellness products.
              </p>
            </div>
          )}


          <div className="product-category-sticky">
            <div
              className="product-category-filters"
              aria-label="Product categories"
            >
              <button
                type="button"
                className={
                  activeCategory ===
                    "all"
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  setActiveCategory(
                    "all"
                  )
                }
              >
                All
              </button>


              {categories.map(
                (category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={
                      activeCategory ===
                        category.slug
                        ? "category-filter active"
                        : "category-filter"
                    }
                    onClick={() =>
                      setActiveCategory(
                        category.slug
                      )
                    }
                  >
                    {category.name}
                  </button>
                )
              )}
            </div>
          </div>


          {cartNotice && (
            <div
              className={`product-cart-notice ${
                cartNotice.type ===
                "error"
                  ? "product-cart-notice-error"
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


          {filteredProducts.length >
          0 ? (
            <div className="product-grid">
              {filteredProducts.map(
                (product) => (
                  <article
                    key={product.id}
                    className="product-card"
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="product-image-area">

                      {product.main_image ? (
                        <img
                          src={
                            product.main_image
                          }
                          alt={
                            product.name
                          }
                          className="product-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="product-image-placeholder">
                          No image available
                        </div>
                      )}


                      {/* ADD TO CART */}

                      <button
                        type="button"
                        className="product-image-cart-button"
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
                          addingProductId ===
                            product.id
                        }
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                      >
                        {addingProductId ===
                        product.id ? (
                          <LoaderCircle
                            size={19}
                            strokeWidth={2}
                            className="product-cart-loader"
                            aria-hidden="true"
                          />
                        ) : (
                          <ShoppingCart
                            size={19}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        )}
                      </button>

                    </div>


                    {/* PRODUCT CONTENT */}

                    <div className="product-card-content">

                      <span className="product-category-name">
                        {
                          product.categories
                            ?.length > 0
                            ? product.categories
                                .map(
                                  (
                                    category
                                  ) =>
                                    category.name
                                )
                                .join(
                                  " · "
                                )
                            : product
                                .category
                                ?.name
                        }
                      </span>


                      <h3>
                        {product.name}
                      </h3>


                      <p>
                        {
                          product.short_description
                        }
                      </p>


                      <div className="product-card-actions">

                        <NavLink
                          to={`/products/${product.slug}`}
                          className="product-learn-button"
                        >
                          Learn More
                        </NavLink>


                        <button
                          type="button"
                          className="product-order-button"
                          aria-label={`Order ${product.name} on WhatsApp`}
                          onClick={() =>
                            handleOrderNow(
                              product
                            )
                          }
                        >
                          Order Now
                        </button>

                      </div>

                    </div>

                  </article>
                )
              )}
            </div>
          ) : (
            <div className="product-catalog-empty">
              No products are currently available in this category.
            </div>
          )}

        </div>
      </section>


      {/* =========================
          WHATSAPP QUANTITY POPUP
      ========================= */}

      {orderProduct && (
        <div
          className="product-order-modal-overlay"
          role="presentation"
          onMouseDown={
            closeOrderModal
          }
        >
          <div
            className="product-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-order-modal-title"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="product-order-modal-close"
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


            <span className="product-order-modal-label">
              ORDER ON WHATSAPP
            </span>


            <h3
              id="product-order-modal-title"
            >
              {orderProduct.name}
            </h3>


            <p>
              Select the quantity you
              would like before
              continuing to WhatsApp.
            </p>


            <div className="product-order-quantity">

              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={
                  parsedQuantity <= 1
                }
                onClick={
                  decreaseOrderQuantity
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
                  handleQuantityInput
                }
                onBlur={
                  handleQuantityBlur
                }
              />


              <button
                type="button"
                aria-label="Increase quantity"
                onClick={
                  increaseOrderQuantity
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
              className="product-order-whatsapp-button"
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


export default ProductCatalog;