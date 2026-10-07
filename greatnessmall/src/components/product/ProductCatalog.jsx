import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  getProductCategories,
  getProducts,
} from "../../services/backend";

import "./ProductCatalog.css";


const ProductCatalog = ({
  showHeader = true,
}) => {
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


  /* =========================================================
     LOAD PRODUCTS + CATEGORIES FROM DJANGO
  ========================================================= */

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


  /* =========================================================
     PRODUCT FILTERING

     Django returns category as an object:

     {
       id,
       name,
       slug,
       ...
     }

     We filter using the category slug.
  ========================================================= */

  const filteredProducts =
    useMemo(() => {
      if (
        activeCategory === "all"
      ) {
        return products;
      }

      return products.filter(
        (product) =>
          product.category?.slug ===
          activeCategory
      );
    }, [
      products,
      activeCategory,
    ]);


  /* =========================================================
     WHATSAPP ORDER LINK
  ========================================================= */

  const whatsappNumber =
    "233578622158";

  const getWhatsAppUrl = (
    product
  ) => {
    const message =
      `Hello Greatness Mall, I am interested in ${product.name}. ` +
      `I saw this product on your website and would like to know more about it.`;

    return (
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(
        message
      )}`
    );
  };


  /* =========================================================
     LOADING
  ========================================================= */

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


  /* =========================================================
     ERROR
  ========================================================= */

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
    <section className="product-catalog">

      <div className="product-catalog-container">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

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


        {/* =====================================================
            CATEGORY FILTERS
        ====================================================== */}

        <div className="product-category-sticky">

          <div
            className="product-category-filters"
            aria-label="Product categories"
          >

            {/* ALL */}

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


            {/* DYNAMIC DJANGO CATEGORIES */}

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


        {/* =====================================================
            PRODUCT GRID
        ====================================================== */}

        {filteredProducts.length > 0 ? (

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

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div className="product-card-content">

                    <span className="product-category-name">
                      {
                        product.category
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


                    {/* ACTIONS */}

                    <div className="product-card-actions">

                      <NavLink
                        to={`/products/${product.slug}`}
                        className="product-learn-button"
                      >
                        Learn More
                      </NavLink>


                      <a
                        href={getWhatsAppUrl(
                          product
                        )}
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
  );
};

export default ProductCatalog;