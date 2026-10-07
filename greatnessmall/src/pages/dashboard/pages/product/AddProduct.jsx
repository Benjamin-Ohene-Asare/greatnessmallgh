import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ProductForm from "./ProductForm";

import {
  createAdminProduct,
  getAdminCategories,
} from "../../../../services/backend";


const AddProduct = () => {
  const navigate =
    useNavigate();

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);


  useEffect(() => {
    let cancelled = false;

    const loadCategories =
      async () => {
        try {
          const data =
            await getAdminCategories();

          if (!cancelled) {
            setCategories(
              Array.isArray(data)
                ? data
                : []
            );
          }
        } catch (error) {
          console.error(
            "Failed to load product categories:",
            error
          );
        } finally {
          if (!cancelled) {
            setLoadingCategories(
              false
            );
          }
        }
      };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);


  const handleAddProduct =
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


      await createAdminProduct(
        formData
      );


      navigate(
        "/admin/products",
        {
          replace: true,
        }
      );
    };


  return (
    <ProductForm
      mode="add"
      categories={
        categories
      }
      loadingCategories={
        loadingCategories
      }
      onSubmit={
        handleAddProduct
      }
    />
  );
};


export default AddProduct;