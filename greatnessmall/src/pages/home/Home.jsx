import React from "react";

import SEO from "../../components/SEO/SEO";

import Hero from "../../components/hero/Hero";
import ProductCatalog from "../../components/product/ProductCatalog";
import WelcomeSection from "../../components/welcome/WelcomeSection";
import FAQSection from "../../components/faqitem/FAQSection";
import Testimonials from "../../components/testimonials/Testimonials";
import UpcomingEvent from "../../components/upcomingEvent/UpcomingEvent";

const Home = () => {
  return (
    <>
      <SEO
        title="Greatness Mall Ghana | Plant-Based Wellness Products"
        description="Explore plant-based wellness products, helpful product information and nationwide delivery from Greatness Mall and Team Greatness in Ghana."
      />

      <section>
        <Hero />
        <ProductCatalog />
        <WelcomeSection />
        <FAQSection />
        <Testimonials />
        <UpcomingEvent />
      </section>
    </>
  );
};

export default Home;