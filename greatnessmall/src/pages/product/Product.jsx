import React from "react";

import SEO from "../../components/SEO/SEO";

import ProductHero from "../../components/producthero/ProductHero";
import ProductCatalog from "../../components/product/ProductCatalog";

const Product = () => {
  return (
    <>
      <SEO
        title="Wellness Products Ghana | Greatness Mall"
        description="Browse Greatness Mall wellness products in Ghana, including plant-based supplements for energy, sleep, detox, men's wellness and women's wellness, with nationwide delivery."
      />

      {/* PRODUCT PAGE HERO */}
      <ProductHero />

      {/* FULL PRODUCT CATALOG */}
      <ProductCatalog showHeader={false} />
    </>
  );
};

export default Product;