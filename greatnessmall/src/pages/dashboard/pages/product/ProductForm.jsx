import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
  Video,
  Package,
  FileText,
  ListChecks,
  FlaskConical,
  Eye,
  Save,
  Upload,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import "./ProductForm.css";


/* Input sanitization */

const sanitizeSingleLine = (
  value = "",
  maxLength = 255
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


const sanitizeLongText = (
  value = "",
  maxLength = 10000
) => {
  return String(value)
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    )
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
};


const sanitizeListItem = (
  value = ""
) => {
  return sanitizeSingleLine(
    value,
    250
  );
};


const sanitizeYouTubeUrl = (
  value = ""
) => {
  const cleaned =
    String(value)
      .trim()
      .slice(0, 500);

  if (!cleaned) {
    return "";
  }

  try {
    const url =
      new URL(cleaned);

    const hostname =
      url.hostname
        .replace(/^www\./, "")
        .toLowerCase();

    const allowedHosts =
      new Set([
        "youtube.com",
        "m.youtube.com",
        "youtu.be",
      ]);

    if (
      !allowedHosts.has(
        hostname
      )
    ) {
      return "";
    }

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return "";
    }

    return cleaned;
  } catch {
    return "";
  }
};


/* Uploaded image validation */

const validateImageFile = (
  file
) => {
  const allowedTypes =
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

  const maxSize =
    5 * 1024 * 1024;

  if (
    !allowedTypes.has(
      file.type
    )
  ) {
    return "Only JPG, PNG and WEBP images are allowed.";
  }

  if (
    file.size > maxSize
  ) {
    return "The image must not exceed 5 MB.";
  }

  return "";
};


const ProductForm = ({
  mode = "add",
  initialData = null,
  categories = [],
  loadingCategories = false,
  onSubmit,
}) => {
  const isEditMode =
    mode === "edit";


  const [
    productData,
    setProductData,
  ] = useState({
    name:
      initialData?.name || "",

    category:
      initialData?.category || "",

    shortDescription:
      initialData?.shortDescription ||
      "",

    tagline:
      initialData?.tagline || "",

    description:
      initialData?.description ||
      "",

    youtubeUrl:
      initialData?.youtubeUrl ||
      "",

    extraInfo:
      initialData?.extraInfo ||
      "",

    published:
      initialData?.published ??
      true,

    displayOrder:
      initialData?.displayOrder ??
      0,

    productImage: null,

    promoImage: null,
  });


  const [
    benefits,
    setBenefits,
  ] = useState(
    initialData?.benefits?.length
      ? initialData.benefits
      : [""]
  );


  const [
    ingredients,
    setIngredients,
  ] = useState(
    initialData?.ingredients?.length
      ? initialData.ingredients
      : [""]
  );


  const [
    productPreview,
    setProductPreview,
  ] = useState(
    initialData?.image || ""
  );


  const [
    promoPreview,
    setPromoPreview,
  ] = useState(
    initialData?.promoImage || ""
  );


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    formError,
    setFormError,
  ] = useState("");


  /* Clean up temporary browser image URLs */

  useEffect(() => {
    return () => {
      if (
        productPreview?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          productPreview
        );
      }
    };
  }, [productPreview]);


  useEffect(() => {
    return () => {
      if (
        promoPreview?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          promoPreview
        );
      }
    };
  }, [promoPreview]);


  /* Basic field changes */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    if (
      type === "checkbox"
    ) {
      setProductData(
        (current) => ({
          ...current,
          [name]: checked,
        })
      );

      return;
    }


    let cleanedValue =
      value;


    switch (name) {
      case "name":
        cleanedValue =
          sanitizeSingleLine(
            value,
            120
          );
        break;


      case "category":
        cleanedValue =
          String(value)
            .replace(
              /\D/g,
              ""
            );
        break;


      case "shortDescription":
        cleanedValue =
          sanitizeLongText(
            value,
            180
          );
        break;


      case "tagline":
        cleanedValue =
          sanitizeSingleLine(
            value,
            160
          );
        break;


      case "description":
        cleanedValue =
          sanitizeLongText(
            value,
            10000
          );
        break;


      case "youtubeUrl":
        cleanedValue =
          String(value)
            .replace(
              /[\u0000-\u001F\u007F]/g,
              ""
            )
            .slice(
              0,
              500
            );
        break;


      case "extraInfo":
        cleanedValue =
          sanitizeLongText(
            value,
            10000
          );
        break;


      case "displayOrder":
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
        break;


      default:
        break;
    }


    setProductData(
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


  /* Main product image */

  const handleProductImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    const fileError =
      validateImageFile(
        file
      );


    if (fileError) {
      setFormError(
        fileError
      );

      event.target.value =
        "";

      return;
    }


    setFormError("");


    setProductData(
      (current) => ({
        ...current,
        productImage: file,
      })
    );


    setProductPreview(
      URL.createObjectURL(
        file
      )
    );
  };


  /* Promotional image */

  const handlePromoImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    const fileError =
      validateImageFile(
        file
      );


    if (fileError) {
      setFormError(
        fileError
      );

      event.target.value =
        "";

      return;
    }


    setFormError("");


    setProductData(
      (current) => ({
        ...current,
        promoImage: file,
      })
    );


    setPromoPreview(
      URL.createObjectURL(
        file
      )
    );
  };


  /* Benefits */

  const updateBenefit = (
    index,
    value
  ) => {
    const cleaned =
      sanitizeListItem(
        value
      );

    setBenefits(
      (current) =>
        current.map(
          (
            item,
            currentIndex
          ) =>
            currentIndex ===
            index
              ? cleaned
              : item
        )
    );
  };


  const addBenefit = () => {
    setBenefits(
      (current) => [
        ...current,
        "",
      ]
    );
  };


  const removeBenefit = (
    index
  ) => {
    setBenefits(
      (current) => {
        if (
          current.length === 1
        ) {
          return current;
        }

        return current.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        );
      }
    );
  };


  /* Ingredients */

  const updateIngredient = (
    index,
    value
  ) => {
    const cleaned =
      sanitizeListItem(
        value
      );

    setIngredients(
      (current) =>
        current.map(
          (
            item,
            currentIndex
          ) =>
            currentIndex ===
            index
              ? cleaned
              : item
        )
    );
  };


  const addIngredient = () => {
    setIngredients(
      (current) => [
        ...current,
        "",
      ]
    );
  };


  const removeIngredient = (
    index
  ) => {
    setIngredients(
      (current) => {
        if (
          current.length === 1
        ) {
          return current;
        }

        return current.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        );
      }
    );
  };


  /* Slug preview only */

  const slugPreview =
    useMemo(() => {
      return productData.name
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
    }, [
      productData.name,
    ]);


  /* Category name for preview */

  const selectedCategoryName =
    useMemo(() => {
      const selected =
        categories.find(
          (category) =>
            String(
              category.id
            ) ===
            String(
              productData.category
            )
        );

      return (
        selected?.name ||
        ""
      );
    }, [
      categories,
      productData.category,
    ]);


  /* Submit */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (submitting) {
        return;
      }


      const cleanName =
        sanitizeSingleLine(
          productData.name,
          120
        ).trim();


      const cleanShortDescription =
        sanitizeLongText(
          productData
            .shortDescription,
          180
        ).trim();


      const cleanTagline =
        sanitizeSingleLine(
          productData.tagline,
          160
        ).trim();


      const cleanDescription =
        sanitizeLongText(
          productData.description,
          10000
        ).trim();


      const cleanExtraInfo =
        sanitizeLongText(
          productData.extraInfo,
          10000
        ).trim();


      if (
        cleanName.length < 2
      ) {
        setFormError(
          "Enter a valid product name."
        );

        return;
      }


      if (
        !productData.category
      ) {
        setFormError(
          "Select a product category."
        );

        return;
      }


      if (
        cleanShortDescription
          .length < 5
      ) {
        setFormError(
          "Enter a valid short description."
        );

        return;
      }


      let cleanYoutubeUrl =
        "";


      if (
        productData.youtubeUrl
          .trim()
      ) {
        cleanYoutubeUrl =
          sanitizeYouTubeUrl(
            productData
              .youtubeUrl
          );

        if (
          !cleanYoutubeUrl
        ) {
          setFormError(
            "Please enter a valid YouTube URL."
          );

          return;
        }
      }


      if (
        !isEditMode &&
        !productData.productImage
      ) {
        setFormError(
          "Please upload a main product image."
        );

        return;
      }


      const cleanBenefits =
        benefits
          .map(
            (item) =>
              sanitizeListItem(
                item
              ).trim()
          )
          .filter(Boolean);


      const cleanIngredients =
        ingredients
          .map(
            (item) =>
              sanitizeListItem(
                item
              ).trim()
          )
          .filter(Boolean);


      const finalData = {
        ...productData,

        name:
          cleanName,

        shortDescription:
          cleanShortDescription,

        tagline:
          cleanTagline,

        description:
          cleanDescription,

        youtubeUrl:
          cleanYoutubeUrl,

        extraInfo:
          cleanExtraInfo,

        benefits:
          cleanBenefits,

        ingredients:
          cleanIngredients,

        displayOrder:
          Math.max(
            0,
            Number.parseInt(
              productData
                .displayOrder,
              10
            ) || 0
          ),
      };


      try {
        setSubmitting(true);
        setFormError("");

        await onSubmit?.(
          finalData
        );
      } catch (error) {
        console.error(
          "Product save failed:",
          error
        );

        setFormError(
          error.message ||
            "The product could not be saved."
        );
      } finally {
        setSubmitting(false);
      }
    };


  return (
    <div className="admin-product-editor">


      {/* Header */}

      <div className="admin-product-editor-header">

        <div>

          <NavLink
            to="/admin/products"
            className="admin-product-editor-back"
          >
            <ArrowLeft
              size={16}
            />

            Products
          </NavLink>


          <span className="admin-product-editor-eyebrow">
            PRODUCT MANAGEMENT
          </span>


          <h1>
            {isEditMode
              ? "Edit Product"
              : "Add Product"}
          </h1>


          <p>
            {isEditMode
              ? "Update the product card and detailed product information."
              : "Create the product card and detailed product information."}
          </p>

        </div>


        <div className="admin-product-editor-actions">

          <button
            type="button"
            className="admin-editor-preview-button"
            disabled={
              !slugPreview
            }
            onClick={() => {
              if (
                !slugPreview
              ) {
                return;
              }

              const previewUrl =
                `/products/${slugPreview}`;

              window.open(
                previewUrl,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <Eye
              size={17}
            />

            Preview
          </button>


          <button
            type="submit"
            form="admin-product-form"
            className="admin-editor-save-button"
            disabled={
              submitting
            }
          >
            <Save
              size={17}
            />

            {submitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Save Product"}
          </button>

        </div>

      </div>


      <form
        id="admin-product-form"
        className="admin-product-editor-layout"
        onSubmit={
          handleSubmit
        }
        noValidate
      >


        {formError && (
          <div
            className="admin-editor-error"
            role="alert"
          >
            {formError}
          </div>
        )}


        <div className="admin-product-editor-main">


          {/* Basic information */}

          <section className="admin-editor-card">

            <div className="admin-editor-card-heading">

              <div className="admin-editor-card-icon">
                <Package
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Basic Product Information
                </h2>

                <p>
                  Used on both the product card and details page.
                </p>
              </div>

            </div>


            <div className="admin-editor-grid">


              <div className="admin-editor-field">

                <label htmlFor="name">
                  Product Name
                  <span>*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={
                    productData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                  maxLength={120}
                  autoComplete="off"
                  placeholder="e.g. SunRise"
                />

              </div>


              <div className="admin-editor-field">

                <label htmlFor="category">
                  Category
                  <span>*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={
                    productData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={
                    loadingCategories
                  }
                >

                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>


                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
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


              <div className="admin-editor-field admin-editor-full">

                <label htmlFor="shortDescription">
                  Short Description
                  <span>*</span>
                </label>

                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={
                    productData
                      .shortDescription
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                  maxLength={180}
                  required
                  placeholder="Short description shown on the product card."
                />

                <div className="admin-editor-helper">

                  <span>
                    Product card description
                  </span>

                  <span>
                    {
                      productData
                        .shortDescription
                        .length
                    }
                    /180
                  </span>

                </div>

              </div>


              <div className="admin-editor-field admin-editor-full">

                <label htmlFor="tagline">
                  Product Tagline
                </label>

                <input
                  id="tagline"
                  type="text"
                  name="tagline"
                  value={
                    productData.tagline
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={160}
                  placeholder="e.g. Defy Age, Embrace Life"
                />

              </div>


              <div className="admin-editor-field">

                <label htmlFor="displayOrder">
                  Display Order
                </label>

                <input
                  id="displayOrder"
                  type="number"
                  name="displayOrder"
                  min="0"
                  step="1"
                  value={
                    productData
                      .displayOrder
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </section>


          {/* Main image */}

          <section className="admin-editor-card">

            <div className="admin-editor-card-heading">

              <div className="admin-editor-card-icon">
                <ImagePlus
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Main Product Image
                </h2>

                <p>
                  Used on the catalog card and detailed page.
                </p>
              </div>

            </div>


            <label className="admin-editor-main-upload">

              {productPreview ? (

                <img
                  src={
                    productPreview
                  }
                  alt="Product preview"
                />

              ) : (

                <>
                  <Upload
                    size={25}
                  />

                  <strong>
                    Upload Product Image
                  </strong>

                  <span>
                    PNG, JPG or WEBP — maximum 5 MB
                  </span>
                </>

              )}


              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleProductImage
                }
              />

            </label>

          </section>


          {/* Full description */}

          <section className="admin-editor-card">

            <div className="admin-editor-card-heading">

              <div className="admin-editor-card-icon">
                <FileText
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Full Product Details
                </h2>

                <p>
                  Main description displayed on the Learn More page.
                </p>
              </div>

            </div>


            <div className="admin-editor-field">

              <textarea
                name="description"
                value={
                  productData
                    .description
                }
                onChange={
                  handleChange
                }
                rows="9"
                maxLength={10000}
                placeholder="Enter the full product description..."
              />

            </div>

          </section>


          {/* Media */}

          <section className="admin-editor-card">

            <div className="admin-editor-card-heading">

              <div className="admin-editor-card-icon">
                <Video
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Product Media
                </h2>

                <p>
                  Video and promotional image displayed on the detailed page.
                </p>
              </div>

            </div>


            <div className="admin-editor-media-grid">


              <div className="admin-editor-field">

                <label htmlFor="youtubeUrl">
                  YouTube URL
                </label>

                <input
                  id="youtubeUrl"
                  type="url"
                  name="youtubeUrl"
                  value={
                    productData
                      .youtubeUrl
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={500}
                  placeholder="https://www.youtube.com/watch?v=..."
                />

                <small>
                  Paste a YouTube link only. Do not paste iframe code.
                </small>

              </div>


              <div className="admin-editor-field">

                <label>
                  Promotional Image
                </label>

                <label className="admin-editor-promo-upload">

                  {promoPreview ? (

                    <img
                      src={
                        promoPreview
                      }
                      alt="Promotional preview"
                    />

                  ) : (

                    <>
                      <ImagePlus
                        size={22}
                      />

                      <span>
                        Upload Promotional Image
                      </span>
                    </>

                  )}


                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={
                      handlePromoImage
                    }
                  />

                </label>

              </div>

            </div>

          </section>


          {/* Benefits */}

          <section className="admin-editor-card">

            <div className="admin-editor-repeatable-heading">

              <div className="admin-editor-card-heading">

                <div className="admin-editor-card-icon">
                  <ListChecks
                    size={19}
                  />
                </div>

                <div>
                  <h2>
                    Major Benefits
                  </h2>

                  <p>
                    Benefits displayed beside the product image.
                  </p>
                </div>

              </div>


              <button
                type="button"
                className="admin-editor-add-item"
                onClick={
                  addBenefit
                }
              >
                <Plus
                  size={15}
                />

                Add Benefit
              </button>

            </div>


            <div className="admin-editor-repeatable-list">

              {benefits.map(
                (
                  benefit,
                  index
                ) => (

                  <div
                    className="admin-editor-repeatable-row"
                    key={
                      `benefit-${index}`
                    }
                  >

                    <span>
                      {index + 1}
                    </span>


                    <input
                      type="text"
                      value={
                        benefit
                      }
                      maxLength={250}
                      onChange={(
                        event
                      ) =>
                        updateBenefit(
                          index,
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Enter product benefit"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        removeBenefit(
                          index
                        )
                      }
                      disabled={
                        benefits.length ===
                        1
                      }
                      aria-label={
                        `Remove benefit ${index + 1}`
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>

                )
              )}

            </div>

          </section>


          {/* Ingredients */}

          <section className="admin-editor-card">

            <div className="admin-editor-repeatable-heading">

              <div className="admin-editor-card-heading">

                <div className="admin-editor-card-icon">
                  <FlaskConical
                    size={19}
                  />
                </div>

                <div>
                  <h2>
                    Main Ingredients
                  </h2>

                  <p>
                    Ingredients displayed on the product details page.
                  </p>
                </div>

              </div>


              <button
                type="button"
                className="admin-editor-add-item"
                onClick={
                  addIngredient
                }
              >
                <Plus
                  size={15}
                />

                Add Ingredient
              </button>

            </div>


            <div className="admin-editor-repeatable-list">

              {ingredients.map(
                (
                  ingredient,
                  index
                ) => (

                  <div
                    className="admin-editor-repeatable-row"
                    key={
                      `ingredient-${index}`
                    }
                  >

                    <span>
                      {index + 1}
                    </span>


                    <input
                      type="text"
                      value={
                        ingredient
                      }
                      maxLength={250}
                      onChange={(
                        event
                      ) =>
                        updateIngredient(
                          index,
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="Enter ingredient"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        removeIngredient(
                          index
                        )
                      }
                      disabled={
                        ingredients.length ===
                        1
                      }
                      aria-label={
                        `Remove ingredient ${index + 1}`
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>

                )
              )}

            </div>

          </section>


          {/* Additional information */}

          <section className="admin-editor-card">

            <div className="admin-editor-card-heading">

              <div className="admin-editor-card-icon">
                <FileText
                  size={19}
                />
              </div>

              <div>
                <h2>
                  Additional Information
                </h2>

                <p>
                  Optional content for the bottom of the product page.
                </p>
              </div>

            </div>


            <div className="admin-editor-field">

              <textarea
                name="extraInfo"
                value={
                  productData
                    .extraInfo
                }
                onChange={
                  handleChange
                }
                rows="6"
                maxLength={10000}
                placeholder="Add additional product information..."
              />

            </div>

          </section>

        </div>


        {/* Preview sidebar */}

        <aside className="admin-editor-sidebar">

          <div className="admin-editor-preview">

            <div className="admin-editor-preview-heading">

              <div>
                <span>
                  LIVE PREVIEW
                </span>

                <h2>
                  Product Card
                </h2>
              </div>

              <Eye
                size={18}
              />

            </div>


            <article className="admin-editor-public-card">

              <div className="admin-editor-public-image">

                {productPreview ? (

                  <img
                    src={
                      productPreview
                    }
                    alt=""
                  />

                ) : (

                  <div>
                    <ImagePlus
                      size={25}
                    />

                    <span>
                      Product Image
                    </span>
                  </div>

                )}

              </div>


              <div className="admin-editor-public-content">

                {selectedCategoryName && (

                  <span className="admin-editor-preview-category">
                    {
                      selectedCategoryName
                    }
                  </span>

                )}


                <h3>
                  {productData.name ||
                    "Product Name"}
                </h3>


                <p>
                  {productData.shortDescription ||
                    "Short product description will appear here."}
                </p>


                <div className="admin-editor-public-buttons">

                  <span>
                    Learn More
                  </span>

                  <span>
                    Order Now
                  </span>

                </div>

              </div>

            </article>


            <div className="admin-editor-url">

              <span>
                Product URL
              </span>

              <code>
                /products/
                {slugPreview ||
                  "product-name"}
              </code>

            </div>


            <div className="admin-editor-publish">

              <div>

                <strong>
                  Published
                </strong>

                <span>
                  Display this product publicly.
                </span>

              </div>


              <label className="admin-editor-switch">

                <input
                  type="checkbox"
                  name="published"
                  checked={
                    productData
                      .published
                  }
                  onChange={
                    handleChange
                  }
                />

                <span></span>

              </label>

            </div>

          </div>

        </aside>

      </form>

    </div>
  );
};


export default ProductForm;