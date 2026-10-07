import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Package,
  Filter,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  deleteAdminProduct,
  getAdminCategories,
  getAdminProducts,
  updateAdminProduct,
} from "../../../../services/backend";

import "./AdminProducts.css";


const formatDate = (
  value
) => {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};


const AdminProducts = () => {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    openMenu,
    setOpenMenu,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    actionLoadingId,
    setActionLoadingId,
  ] = useState(null);


  const statuses = [
    "All",
    "Published",
    "Draft",
  ];


  // Load products and categories from Django
  useEffect(() => {
    let cancelled = false;

    const loadProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            productData,
            categoryData,
          ] =
            await Promise.all([
              getAdminProducts(),
              getAdminCategories(),
            ]);

          if (cancelled) {
            return;
          }

          setProducts(
            Array.isArray(
              productData
            )
              ? productData
              : []
          );

          setCategories(
            Array.isArray(
              categoryData
            )
              ? categoryData
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load admin products:",
            err
          );

          if (!cancelled) {
            setError(
              err.message ||
                "Products could not be loaded."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);


  // Filter products locally for fast dashboard searching
  const filteredProducts =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const categoryName =
            product.category
              ?.name ||
            "";

          const status =
            product.is_published
              ? "Published"
              : "Draft";

          const matchesSearch =
            !normalizedSearch ||
            product.name
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            categoryName
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesCategory =
            categoryFilter ===
              "All" ||
            categoryName ===
              categoryFilter;

          const matchesStatus =
            statusFilter ===
              "All" ||
            status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          );
        }
      );
    }, [
      products,
      searchTerm,
      categoryFilter,
      statusFilter,
    ]);


  // Publish or move a product back to draft
  const togglePublishStatus =
    async (
      product
    ) => {
      try {
        setActionLoadingId(
          product.id
        );

        const formData =
          new FormData();

        formData.append(
          "is_published",
          String(
            !product.is_published
          )
        );

        const updated =
          await updateAdminProduct(
            product.id,
            formData
          );

        setProducts(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                product.id
                  ? updated
                  : item
            )
        );

        setOpenMenu(null);
      } catch (err) {
        console.error(
          "Failed to update product status:",
          err
        );

        window.alert(
          err.message ||
            "Could not update the product."
        );
      } finally {
        setActionLoadingId(
          null
        );
      }
    };


  // Delete a product permanently
  const deleteProduct =
    async (
      product
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to remove "${product.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoadingId(
          product.id
        );

        await deleteAdminProduct(
          product.id
        );

        setProducts(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                product.id
            )
        );

        setOpenMenu(null);
      } catch (err) {
        console.error(
          "Failed to delete product:",
          err
        );

        window.alert(
          err.message ||
            "Could not delete the product."
        );
      } finally {
        setActionLoadingId(
          null
        );
      }
    };


  return (
    <div className="admin-products-page">

      <div className="admin-products-header">

        <div>

          <span className="admin-products-eyebrow">
            PRODUCT MANAGEMENT
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage products displayed on the Greatness Mall website.
          </p>

        </div>


        <NavLink
          to="/admin/products/add"
          className="admin-add-product-button"
        >
          <Plus
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          Add Product
        </NavLink>

      </div>


      <div className="admin-products-summary">

        <div className="admin-products-summary-card">

          <div className="admin-products-summary-icon">
            <Package
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

        </div>


        <div className="admin-products-summary-card">

          <div className="admin-products-summary-icon published">
            <Package
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Published
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.is_published
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="admin-products-summary-card">

          <div className="admin-products-summary-icon draft">
            <Package
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Drafts
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    !product.is_published
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      <div className="admin-products-toolbar">

        <div className="admin-products-search">

          <Search
            size={17}
            strokeWidth={1.7}
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-products-filter-group">

          <div className="admin-products-filter">

            <Filter
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <select
              value={
                categoryFilter
              }
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              aria-label="Filter products by category"
            >

              <option value="All">
                All
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.name
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                )
              )}

            </select>

          </div>


          <div className="admin-products-filter">

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filter products by status"
            >

              {statuses.map(
                (status) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {status}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

      </div>


      <div className="admin-products-table-card">

        {loading ? (

          <div className="admin-products-empty">
            <Package
              size={35}
              strokeWidth={1.5}
            />

            <h2>
              Loading products...
            </h2>
          </div>

        ) : error ? (

          <div
            className="admin-products-empty"
            role="alert"
          >
            <Package
              size={35}
              strokeWidth={1.5}
            />

            <h2>
              Products unavailable
            </h2>

            <p>
              {error}
            </p>
          </div>

        ) : filteredProducts.length >
          0 ? (

          <div className="admin-products-table-scroll">

            <table className="admin-products-table">

              <thead>
                <tr>
                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Last Updated
                  </th>

                  <th className="admin-products-action-heading">
                    Actions
                  </th>
                </tr>
              </thead>


              <tbody>

                {filteredProducts.map(
                  (product) => {
                    const status =
                      product.is_published
                        ? "Published"
                        : "Draft";

                    const isWorking =
                      actionLoadingId ===
                      product.id;

                    return (
                      <tr
                        key={
                          product.id
                        }
                      >

                        <td>

                          <div className="admin-products-product-cell">

                            <div className="admin-products-product-image">

                              {product.main_image ? (
                                <img
                                  src={
                                    product.main_image
                                  }
                                  alt={
                                    product.name
                                  }
                                  loading="lazy"
                                />
                              ) : (
                                <Package
                                  size={20}
                                  strokeWidth={1.6}
                                  aria-hidden="true"
                                />
                              )}

                            </div>


                            <div>

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              <span>
                                Product #
                                {
                                  product.id
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>
                          {
                            product
                              .category
                              ?.name ||
                            "—"
                          }
                        </td>


                        <td>

                          <span
                            className={
                              status ===
                              "Published"
                                ? "admin-product-status published"
                                : "admin-product-status draft"
                            }
                          >
                            {status}
                          </span>

                        </td>


                        <td>
                          {
                            formatDate(
                              product.updated_at
                            )
                          }
                        </td>


                        <td className="admin-products-actions-cell">

                          <div className="admin-products-row-actions">

                            <NavLink
                              to={
                                `/products/${product.slug}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-product-icon-button"
                              aria-label={
                                `Preview ${product.name}`
                              }
                            >
                              <Eye
                                size={16}
                                strokeWidth={1.7}
                              />
                            </NavLink>


                            <NavLink
                              to={
                                `/admin/products/${product.id}/edit`
                              }
                              className="admin-product-icon-button"
                              aria-label={
                                `Edit ${product.name}`
                              }
                            >
                              <Pencil
                                size={16}
                                strokeWidth={1.7}
                              />
                            </NavLink>


                            <div className="admin-product-more-wrapper">

                              <button
                                type="button"
                                className="admin-product-icon-button"
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu ===
                                      product.id
                                      ? null
                                      : product.id
                                  )
                                }
                                aria-label={
                                  `More actions for ${product.name}`
                                }
                                disabled={
                                  isWorking
                                }
                              >
                                <MoreVertical
                                  size={17}
                                  strokeWidth={1.7}
                                />
                              </button>


                              {openMenu ===
                                product.id && (

                                <div className="admin-product-action-menu">

                                  <button
                                    type="button"
                                    disabled={
                                      isWorking
                                    }
                                    onClick={() =>
                                      togglePublishStatus(
                                        product
                                      )
                                    }
                                  >
                                    {isWorking
                                      ? "Updating..."
                                      : status ===
                                          "Published"
                                        ? "Move to Draft"
                                        : "Publish Product"}
                                  </button>


                                  <button
                                    type="button"
                                    className="danger"
                                    disabled={
                                      isWorking
                                    }
                                    onClick={() =>
                                      deleteProduct(
                                        product
                                      )
                                    }
                                  >
                                    <Trash2
                                      size={14}
                                      strokeWidth={1.7}
                                    />

                                    Delete Product
                                  </button>

                                </div>

                              )}

                            </div>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="admin-products-empty">

            <Package
              size={35}
              strokeWidth={1.5}
            />

            <h2>
              No products found
            </h2>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};


export default AdminProducts;