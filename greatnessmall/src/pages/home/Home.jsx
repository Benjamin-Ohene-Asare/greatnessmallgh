import React from "react";

import Hero from "../../components/hero/Hero";
import ProductCatalog from "../../components/product/ProductCatalog";
import WelcomeSection from "../../components/welcome/WelcomeSection";
import FAQSection from "../../components/faqitem/FAQSection";
import Testimonials from "../../components/testimonials/Testimonials";

const Home = () => {
  return (
    <section>
      <Hero />
      <ProductCatalog />
      <WelcomeSection />
      <FAQSection />
      <Testimonials />
    </section>
  );
};

export default Home;