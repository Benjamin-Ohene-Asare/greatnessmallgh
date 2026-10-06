import React from "react";
import Hero from "../../components/hero/Hero";
import ProductCatalog from "../../components/product/ProductCatalog";
import WelcomeSection from "../../components/welcome/WelcomeSection";
import FaqSection from "../../components/faqitem/FaqSection";
import Testimonials from "../../components/testimonials/Testimonials";
const Home = () => {
  return (
    <section>
      <Hero />
      <ProductCatalog />
      <WelcomeSection />
      <FaqSection />
      <Testimonials />

    </section>
  );
};

export default Home;