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


  const backendUrl =
    import.meta.env.VITE_BACKEND_URL
      ?.replace(/\/$/, "") || "";

  const whatsappNumber =
    "233578622158";


  const getProductShareUrl = (
    product
  ) => {
    return (
      `${backendUrl}/products/share/` +
      `${product.slug}/`
    );
  };


  const getWhatsAppUrl = (
    product
  ) => {
    const productUrl =
      getProductShareUrl(product);

    const message =
      `Hello Greatness Mall, I am interested in ${product.name}. ` +
      `I saw this product on your website and would like to know more about it.\n\n` +
      `Product:\n${productUrl}`;

    return (
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(
        message
      )}`
    );
  };


  const handleShare = async (
    product
  ) => {
    const productUrl =
      getProductShareUrl(product);

    const shareData = {
      title: product.name,
      text:
        product.short_description ||
        `Discover ${product.name} at Greatness Mall.`,
      url: productUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );
        return;
      }

      await navigator.clipboard.writeText(
        productUrl
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


        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(
              (product) => (
                <article
                  key={product.id}
                  className="product-card"
                >

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