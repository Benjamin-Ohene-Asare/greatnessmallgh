import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Tags,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "../../../../services/backend";

import "./AdminCategories.css";


const sanitizeSingleLine = (
  value = "",
  maxLength = 100
) => {
  return String(value)
    .replace(
      /[\u0000-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
};


const sanitizeDescription = (
  value = ""
) => {
  return String(value)
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .slice(0, 250);
};


const createSlug = (
  name
) => {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );
};


const AdminCategories = () => {
  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    description: "",
    active: true,
    displayOrder: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    actionId,
    setActionId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    formError,
    setFormError,
  ] = useState("");


  // Load categories from Django
  useEffect(() => {
    let cancelled = false;

    const loadCategories =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getAdminCategories();

          if (
            cancelled
          ) {
            return;
          }

          setCategories(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load categories:",
            err
          );

          if (!cancelled) {
            setError(
              err.message ||
                "Categories could not be loaded."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);


  const filteredCategories =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return categories;
      }

      return categories.filter(
        (category) => {
          return (
            category.name
              ?.toLowerCase()
              .includes(search) ||
            category.description
              ?.toLowerCase()
              .includes(search)
          );
        }
      );
    }, [
      categories,
      searchTerm,
    ]);


  const openAddForm = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      active: true,
      displayOrder: 0,
    });

    setFormError("");
    setShowForm(true);
  };


  const openEditForm = (
    category
  ) => {
    setEditingCategory(
      category
    );

    setFormData({
      name:
        category.name ||
        "",

      description:
        category.description ||
        "",

      active:
        Boolean(
          category.is_active
        ),

      displayOrder:
        category.display_order ??
        0,
    });

    setFormError("");
    setShowForm(true);
  };


  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingCategory(null);
    setFormError("");
  };


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    let cleanedValue =
      value;

    if (
      type === "checkbox"
    ) {
      cleanedValue =
        checked;
    } else if (
      name === "name"
    ) {
      cleanedValue =
        sanitizeSingleLine(
          value,
          100
        );
    } else if (
      name ===
      "description"
    ) {
      cleanedValue =
        sanitizeDescription(
          value
        );
    } else if (
      name ===
      "displayOrder"
    ) {
      cleanedValue =
        String(value)
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            6
          );
    }

    setFormData(
      (current) => ({
        ...current,
        [name]:
          cleanedValue,
      })
    );

    if (formError) {
      setFormError("");
    }
  };


  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (saving) {
        return;
      }

      const cleanName =
        sanitizeSingleLine(
          formData.name,
          100
        ).trim();

      const cleanDescription =
        sanitizeDescription(
          formData.description
        ).trim();

      if (
        cleanName.length < 2
      ) {
        setFormError(
          "Enter a valid category name."
        );

        return;
      }

      const payload = {
        name:
          cleanName,

        description:
          cleanDescription,

        is_active:
          Boolean(
            formData.active
          ),

        display_order:
          Math.max(
            0,
            Number.parseInt(
              formData.displayOrder,
              10
            ) || 0
          ),
      };

      try {
        setSaving(true);
        setFormError("");

        if (
          editingCategory
        ) {
          const updated =
            await updateAdminCategory(
              editingCategory.id,
              payload
            );

          setCategories(
            (current) =>
              current.map(
                (category) =>
                  category.id ===
                  editingCategory.id
                    ? updated
                    : category
              )
          );
        } else {
          const created =
            await createAdminCategory(
              payload
            );

          setCategories(
            (current) => [
              ...current,
              created,
            ]
          );
        }

        setShowForm(false);
        setEditingCategory(
          null
        );
      } catch (err) {
        console.error(
          "Category save failed:",
          err
        );

        setFormError(
          err.message ||
            "The category could not be saved."
        );
      } finally {
        setSaving(false);
      }
    };


  const toggleCategory =
    async (
      category
    ) => {
      try {
        setActionId(
          category.id
        );

        const updated =
          await updateAdminCategory(
            category.id,
            {
              is_active:
                !category.is_active,
            }
          );

        setCategories(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                category.id
                  ? updated
                  : item
            )
        );
      } catch (err) {
        console.error(
          "Category status update failed:",
          err
        );

        window.alert(
          err.message ||
            "Could not update category status."
        );
      } finally {
        setActionId(
          null
        );
      }
    };


  const deleteCategory =
    async (
      category
    ) => {
      if (
        category.product_count >
        0
      ) {
        window.alert(
          "This category still contains products. Reassign those products before deleting the category."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${category.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionId(
          category.id
        );

        await deleteAdminCategory(
          category.id
        );

        setCategories(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                category.id
            )
        );
      } catch (err) {
        console.error(
          "Category delete failed:",
          err
        );

        window.alert(
          err.message ||
            "The category could not be deleted."
        );
      } finally {
        setActionId(
          null
        );
      }
    };


  return (
    <div className="admin-categories-page">

      <div className="admin-categories-header">

        <div>

          <span className="admin-categories-eyebrow">
            PRODUCT MANAGEMENT
          </span>

          <h1>
            Categories
          </h1>

          <p>
            Organize products into categories displayed across the website.
          </p>

        </div>


        <button
          type="button"
          className="admin-category-add-button"
          onClick={
            openAddForm
          }
        >
          <Plus
            size={17}
            strokeWidth={1.8}
          />

          Add Category
        </button>

      </div>


      <div className="admin-category-summary-grid">

        <div className="admin-category-summary-card">

          <div className="admin-category-summary-icon">
            <Tags
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Total Categories
            </span>

            <strong>
              {categories.length}
            </strong>
          </div>

        </div>


        <div className="admin-category-summary-card">

          <div className="admin-category-summary-icon active">
            <CheckCircle2
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Active
            </span>

            <strong>
              {
                categories.filter(
                  (category) =>
                    category.is_active
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="admin-category-summary-card">

          <div className="admin-category-summary-icon inactive">
            <XCircle
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <span>
              Inactive
            </span>

            <strong>
              {
                categories.filter(
                  (category) =>
                    !category.is_active
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      <div className="admin-category-toolbar">

        <div className="admin-category-search">

          <Search
            size={17}
            strokeWidth={1.7}
          />

          <input
            type="search"
            placeholder="Search categories..."
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

      </div>


      <div className="admin-category-table-card">

        {loading ? (

          <div className="admin-category-empty">

            <Tags
              size={35}
              strokeWidth={1.5}
            />

            <h2>
              Loading categories...
            </h2>

          </div>

        ) : error ? (

          <div
            className="admin-category-empty"
            role="alert"
          >

            <Tags
              size={35}
              strokeWidth={1.5}
            />

            <h2>
              Categories unavailable
            </h2>

            <p>
              {error}
            </p>

          </div>

        ) : filteredCategories.length >
          0 ? (

          <div className="admin-category-table-scroll">

            <table className="admin-category-table">

              <thead>
                <tr>
                  <th>
                    Category
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Products
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Slug
                  </th>

                  <th className="admin-category-actions-heading">
                    Actions
                  </th>
                </tr>
              </thead>


              <tbody>

                {filteredCategories.map(
                  (category) => {
                    const isWorking =
                      actionId ===
                      category.id;

                    return (
                      <tr
                        key={
                          category.id
                        }
                      >

                        <td>
                          <strong>
                            {
                              category.name
                            }
                          </strong>
                        </td>


                        <td>
                          <span className="admin-category-description">
                            {category.description ||
                              "No description"}
                          </span>
                        </td>


                        <td>
                          {
                            category.product_count ??
                            0
                          }
                        </td>


                        <td>

                          <button
                            type="button"
                            className={
                              category.is_active
                                ? "admin-category-status active"
                                : "admin-category-status inactive"
                            }
                            onClick={() =>
                              toggleCategory(
                                category
                              )
                            }
                            disabled={
                              isWorking
                            }
                          >
                            {isWorking
                              ? "Updating..."
                              : category.is_active
                                ? "Active"
                                : "Inactive"}
                          </button>

                        </td>


                        <td>
                          <code className="admin-category-slug">
                            {
                              category.slug
                            }
                          </code>
                        </td>


                        <td>

                          <div className="admin-category-row-actions">

                            <button
                              type="button"
                              className="admin-category-icon-button"
                              onClick={() =>
                                openEditForm(
                                  category
                                )
                              }
                              disabled={
                                isWorking
                              }
                              aria-label={
                                `Edit ${category.name}`
                              }
                            >
                              <Pencil
                                size={16}
                                strokeWidth={1.7}
                              />
                            </button>


                            <button
                              type="button"
                              className="admin-category-icon-button danger"
                              onClick={() =>
                                deleteCategory(
                                  category
                                )
                              }
                              disabled={
                                isWorking
                              }
                              aria-label={
                                `Delete ${category.name}`
                              }
                            >
                              <Trash2
                                size={16}
                                strokeWidth={1.7}
                              />
                            </button>

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

          <div className="admin-category-empty">

            <Tags
              size={35}
              strokeWidth={1.5}
            />

            <h2>
              No categories found
            </h2>

            <p>
              Try another search or add a category.
            </p>

          </div>

        )}

      </div>


      {showForm && (

        <div
          className="admin-category-modal-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >

          <div
            className="admin-category-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
          >

            <div className="admin-category-modal-header">

              <div>

                <span>
                  CATEGORY MANAGEMENT
                </span>

                <h2 id="category-form-title">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

              </div>


              <button
                type="button"
                className="admin-category-modal-close"
                onClick={
                  closeForm
                }
                disabled={
                  saving
                }
                aria-label="Close category form"
              >
                ×
              </button>

            </div>


            <form
              className="admin-category-form"
              onSubmit={
                handleSubmit
              }
            >

              {formError && (
                <div
                  className="admin-category-form-error"
                  role="alert"
                >
                  {formError}
                </div>
              )}


              <div className="admin-category-field">

                <label htmlFor="category-name">
                  Category Name
                  <span>*</span>
                </label>

                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Daily Wellness"
                  required
                  maxLength={100}
                  autoComplete="off"
                />

              </div>


              <div className="admin-category-field">

                <label htmlFor="category-description">
                  Description
                </label>

                <textarea
                  id="category-description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                  maxLength={250}
                  placeholder="Briefly describe this category."
                />

              </div>


              <div className="admin-category-field">

                <label htmlFor="category-order">
                  Display Order
                </label>

                <input
                  id="category-order"
                  type="number"
                  name="displayOrder"
                  min="0"
                  step="1"
                  value={
                    formData.displayOrder
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="admin-category-slug-preview">

                <span>
                  URL Slug
                </span>

                <code>
                  {createSlug(
                    formData.name
                  ) ||
                    "category-name"}
                </code>

              </div>


              <label className="admin-category-toggle-row">

                <div>

                  <strong>
                    Active Category
                  </strong>

                  <span>
                    Allow this category to appear on the website.
                  </span>

                </div>


                <input
                  type="checkbox"
                  name="active"
                  checked={
                    formData.active
                  }
                  onChange={
                    handleChange
                  }
                />

              </label>


              <div className="admin-category-form-actions">

                <button
                  type="button"
                  className="admin-category-cancel-button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-category-save-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};


export default AdminCategories;