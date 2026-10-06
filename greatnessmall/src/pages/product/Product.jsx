import React from "react";

import ProductHero from "../../components/producthero/ProductHero";
import ProductCatalog from "../../components/product/ProductCatalog";

const Product = () => {
  return (
    <>
      {/* PRODUCT PAGE HERO */}
      <ProductHero />

      {/* FULL PRODUCT CATALOG */}
      <ProductCatalog showHeader={false} />
    </>
  );
};

export default Product;