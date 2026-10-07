import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ProductForm from "./ProductForm";

import {
  getAdminCategories,
  getAdminProduct,
  updateAdminProduct,
} from "../../../../services/backend";


const EditProduct = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    let cancelled = false;

    const loadProduct =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            productData,
            categoryData,
          ] = await Promise.all([
            getAdminProduct(id),
            getAdminCategories(),
          ]);

          if (cancelled) {
            return;
          }


          setCategories(
            Array.isArray(
              categoryData
            )
              ? categoryData
              : []
          );


          setProduct({
            id:
              productData.id,

            name:
              productData.name ||
              "",

            category:
              String(
                productData
                  .category
                  ?.id ||
                ""
              ),

            shortDescription:
              productData
                .short_description ||
              "",

            tagline:
              productData.tagline ||
              "",

            description:
              productData
                .description ||
              "",

            image:
              productData
                .main_image ||
              "",

            promoImage:
              productData
                .promotional_image ||
              "",

            youtubeUrl:
              productData
                .youtube_url ||
              "",

            extraInfo:
              productData
                .extra_information ||
              "",

            benefits:
              Array.isArray(
                productData.benefits
              )
                ? productData
                    .benefits
                    .map(
                      (item) =>
                        item.text
                    )
                : [],

            ingredients:
              Array.isArray(
                productData.ingredients
              )
                ? productData
                    .ingredients
                    .map(
                      (item) =>
                        item.name
                    )
                : [],

            published:
              Boolean(
                productData
                  .is_published
              ),

            displayOrder:
              productData
                .display_order ??
              0,
          });

        } catch (err) {
          console.error(
            "Failed to load product:",
            err
          );

          if (!cancelled) {
            setError(
              err.message ||
                "The selected product could not be loaded."
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
  }, [id]);


  const handleUpdateProduct =
    async (
      productData
    ) => {
      const formData =
        new FormData();


      formData.append(
        "name",
        productData.name
      );

      formData.append(
        "category_id",
        productData.category
      );

      formData.append(
        "short_description",
        productData.shortDescription
      );

      formData.append(
        "tagline",
        productData.tagline
      );

      formData.append(
        "description",
        productData.description
      );

      formData.append(
        "youtube_url",
        productData.youtubeUrl
      );

      formData.append(
        "extra_information",
        productData.extraInfo
      );

      formData.append(
        "is_published",
        String(
          productData.published
        )
      );

      formData.append(
        "display_order",
        String(
          productData.displayOrder ||
          0
        )
      );


      if (
        productData.productImage
      ) {
        formData.append(
          "main_image",
          productData.productImage
        );
      }


      if (
        productData.promoImage
      ) {
        formData.append(
          "promotional_image",
          productData.promoImage
        );
      }


      formData.append(
        "benefits",
        JSON.stringify(
          productData.benefits.map(
            (
              text,
              index
            ) => ({
              text,
              display_order:
                index,
            })
          )
        )
      );


      formData.append(
        "ingredients",
        JSON.stringify(
          productData.ingredients.map(
            (
              name,
              index
            ) => ({
              name,
              display_order:
                index,
            })
          )
        )
      );


      await updateAdminProduct(
        id,
        formData
      );


      navigate(
        "/admin/products",
        {
          replace: true,
        }
      );
    };


  if (loading) {
    return (
      <div className="admin-editor-not-found">

        <h1>
          Loading Product
        </h1>

        <p>
          Please wait while the product is being loaded.
        </p>

      </div>
    );
  }


  if (
    error ||
    !product
  ) {
    return (
      <div className="admin-editor-not-found">

        <h1>
          Product Not Found
        </h1>

        <p>
          {error ||
            "The selected product could not be found."}
        </p>

      </div>
    );
  }


  return (
    <ProductForm
      mode="edit"
      initialData={product}
      categories={categories}
      loadingCategories={false}
      onSubmit={
        handleUpdateProduct
      }
    />
  );
};


export default EditProduct;